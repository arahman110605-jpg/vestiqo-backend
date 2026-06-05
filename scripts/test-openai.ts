import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  console.log('Testing OpenAI connection...');
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello in one word' }],
    }, {
      timeout: 10000, // 10 seconds timeout
    });
    console.log('Success:', response.choices[0].message.content);
  } catch (error: any) {
    console.error('Error during API call:', error);
  }
}

test();
