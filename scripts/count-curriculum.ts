import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pathsCount = await prisma.learningPath.count();
  const lessonsCount = await prisma.lesson.count();
  const quizzesCount = await prisma.quiz.count();

  console.log('======================================');
  console.log('📊 CURRICULUM DATABASE VERIFICATION');
  console.log('======================================');
  console.log(`Learning Paths (Levels): ${pathsCount} (Expected: 14)`);
  console.log(`Lessons:                 ${lessonsCount} (Expected: 150)`);
  console.log(`Quizzes:                 ${quizzesCount} (Expected: 150)`);
  console.log('======================================');

  // Let's print the count per path
  const paths = await prisma.learningPath.findMany({
    include: {
      _count: {
        select: { lessons: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  console.log('\nLevel-by-Level Breakdown:');
  for (const path of paths) {
    console.log(`- [Path ${path.id}] ${path.name}: ${path._count.lessons} lessons`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
