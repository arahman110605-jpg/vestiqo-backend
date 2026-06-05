import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🛡️ Starting database security hardening...');

  // 1. Fetch all tables in the public schema
  const tablesResult: any[] = await prisma.$queryRawUnsafe(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
  `);

  const tableNames = tablesResult.map(r => r.table_name);
  console.log(`Found ${tableNames.length} tables in public schema.`);

  // 2. Enable RLS on all tables
  for (const tableName of tableNames) {
    try {
      console.log(`Enabling RLS on: "${tableName}"`);
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "public"."${tableName}" ENABLE ROW LEVEL SECURITY;
      `);
    } catch (err: any) {
      console.error(`❌ Failed to enable RLS on "${tableName}":`, err.message);
    }
  }

  // 3. Create covering indexes for foreign keys to optimize performance
  const indexQueries = [
    { name: 'idx_aiconversation_userid', table: 'AiConversation', column: 'userId' },
    { name: 'idx_classroom_organizationid', table: 'Classroom', column: 'organizationId' },
    { name: 'idx_lesson_learningpathid', table: 'Lesson', column: 'learningPathId' },
    { name: 'idx_lessonversion_lessonid', table: 'LessonVersion', column: 'lessonId' },
    { name: 'idx_notification_userid', table: 'Notification', column: 'userId' },
    { name: 'idx_quiz_lessonid', table: 'Quiz', column: 'lessonId' },
    { name: 'idx_quizattempt_userid', table: 'QuizAttempt', column: 'userId' },
    { name: 'idx_quizattempt_quizid', table: 'QuizAttempt', column: 'quizId' },
    { name: 'idx_simulatororder_accountid', table: 'SimulatorOrder', column: 'accountId' },
    { name: 'idx_simulatorposition_accountid', table: 'SimulatorPosition', column: 'accountId' },
    { name: 'idx_simulatorposition_stockid', table: 'SimulatorPosition', column: 'stockId' },
    { name: 'idx_stockprice_stockid', table: 'StockPrice', column: 'stockId' },
    { name: 'idx_student_userid', table: 'Student', column: 'userId' },
    { name: 'idx_student_classroomid', table: 'Student', column: 'classroomId' },
    { name: 'idx_subscription_userid', table: 'Subscription', column: 'userId' },
    { name: 'idx_watchlist_userid', table: 'Watchlist', column: 'userId' },
  ];

  console.log('\n⚡ Creating covering indexes for foreign keys...');
  for (const idx of indexQueries) {
    try {
      console.log(`Creating index "${idx.name}" on "${idx.table}"("${idx.column}")`);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "${idx.name}" ON "public"."${idx.table}"("${idx.column}");
      `);
    } catch (err: any) {
      console.error(`❌ Failed to create index "${idx.name}":`, err.message);
    }
  }

  console.log('\n🎉 Database security and performance hardening complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
