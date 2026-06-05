import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { syllabus } from './syllabus';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🌱 Starting Grand AI OpenAI Curriculum Generator...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY is not set in .env');
    process.exit(1);
  }

  let totalGenerated = 0;

  for (const levelData of syllabus) {
    console.log(`\n======================================`);
    console.log(`📚 Processing ${levelData.level}...`);
    
    // 1. Ensure Path exists
    let path = await prisma.learningPath.findFirst({
      where: { name: levelData.level }
    });

    if (!path) {
      path = await prisma.learningPath.create({
        data: {
          name: levelData.level,
          description: levelData.description,
        }
      });
      console.log(`Created new Learning Path: ${path.name}`);
    }

    // 2. Iterate through topics
    for (const topic of levelData.topics) {
      // Check if this specific lesson already exists in this path
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          learningPathId: path.id,
          title: topic
        }
      });

      if (existingLesson) {
        console.log(`⏭️  Skipping "${topic}" (Already exists)`);
        continue;
      }

      console.log(`🤖 Generating Lesson: "${topic}"...`);
      
      let success = false;
      let retries = 0;

      while (!success && retries < 5) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert financial educator. You must respond with a JSON object containing:
                1. "content": A detailed lesson on the requested topic that fits into the broader course level. Explain how it works and how to use it in practical trading/investing. Use beautiful Markdown formatting with bullet points, bolding, and practical analogies. About 3-5 paragraphs.
                2. "type": Must be 'Quick', 'Deep', or 'Simulation'.
                3. "quiz": An array of exactly 2 multiple-choice questions testing key concepts of the lesson. Each question must have options (array of 4 strings) and correctIndex (0-3) indicating the correct answer.`
              },
              {
                role: 'user',
                content: `Write a detailed lesson and quiz for the topic "${topic}" in the course level "${levelData.level}".`
              }
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'single_lesson',
                strict: true,
                schema: {
                  type: 'object',
                  properties: {
                    content: { type: 'string' },
                    type: { type: 'string', enum: ['Quick', 'Deep', 'Simulation'] },
                    quiz: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          question: { type: 'string' },
                          options: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          correctIndex: { type: 'integer' }
                        },
                        required: ["question", "options", "correctIndex"],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ["content", "type", "quiz"],
                  additionalProperties: false
                }
              }
            },
            temperature: 0.7,
          });

          const lessonData = JSON.parse(response.choices[0].message.content || '{}');

          const lesson = await prisma.lesson.create({
            data: {
              learningPathId: path.id,
              title: topic,
              content: lessonData.content,
              type: lessonData.type,
            }
          });

          await prisma.quiz.create({
            data: {
              lessonId: lesson.id,
              questions: lessonData.quiz,
            }
          });

          console.log(`✅ Saved "${topic}" successfully.`);
          totalGenerated++;
          success = true;

          // Short delay to avoid spamming the connection pool
          await delay(1000); 

        } catch (err: any) {
           console.error(`❌ Failed to generate "${topic}":`, err.message);
           retries++;
           console.log(`Waiting 10 seconds before retrying... (Attempt ${retries}/5)`);
           await delay(10000); 
        }
      }
    }
  }

  console.log(`\n✨ Generation Complete! Generated ${totalGenerated} new lessons.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
