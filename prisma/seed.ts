import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeder (AI Generated Curriculum)...');

  // Clear existing to avoid duplicates
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonVersion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.learningPath.deleteMany();

  // ---------------------------------------------------------
  // Beginner Path
  // ---------------------------------------------------------
  const beginnerPath = await prisma.learningPath.create({
    data: {
      name: 'Beginner: Stock Market 101',
      description: 'The absolute fundamentals of investing and how the market works.',
    }
  });

  const bLesson1 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id,
      title: 'What is a Stock?',
      type: 'Quick',
      content: `### Welcome to the Market!
A **stock** (also known as equity) represents a fraction of ownership in a business. When you buy a share of a stock, you are buying a small piece of that company.

* **Why do companies issue stock?** To raise money! If a company wants to build a new factory, they can borrow money (debt) or sell a piece of the company to the public (equity).
* **How do you make money?** 
  1. **Capital Appreciation:** The stock price goes up.
  2. **Dividends:** The company pays out a portion of its profits directly to you.

If you own 1 share of Apple, you literally own a (tiny) piece of everything Apple does!`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: bLesson1.id,
      questions: [
        {
          question: "When you buy a stock, what are you actually buying?",
          options: ["A loan given to a company", "A fraction of ownership in a business", "A physical product", "A guarantee of profit"],
          correctIndex: 1
        },
        {
          question: "What are the two primary ways investors make money from stocks?",
          options: ["Taxes and Fees", "Capital Appreciation and Dividends", "Shorting and Options", "Buying and Holding"],
          correctIndex: 1
        }
      ]
    }
  });

  // ---------------------------------------------------------
  // Intermediate Path
  // ---------------------------------------------------------
  const interPath = await prisma.learningPath.create({
    data: {
      name: 'Intermediate: Technical Analysis',
      description: 'Learn how to read charts and understand market psychology.',
    }
  });

  const iLesson1 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id,
      title: 'Candlestick Anatomy',
      type: 'Deep',
      content: `### Reading the Price Action
A **Candlestick** is a visual representation of price movement over a specific time period (e.g., 1 day, 1 hour, 5 minutes).

Every candlestick has 4 main data points (OHLC):
* **Open (O):** The price when the time period started.
* **High (H):** The highest price reached during the period.
* **Low (L):** The lowest price reached during the period.
* **Close (C):** The price when the time period ended.

**The Body:** The thick part of the candle. If it's green, the Close was higher than the Open. If it's red, the Close was lower than the Open.
**The Wicks (Shadows):** The thin lines on top and bottom showing the high and low extremes.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: iLesson1.id,
      questions: [
        {
          question: "What does the 'Body' of a green candlestick represent?",
          options: ["The highest price of the day", "The lowest price of the day", "The range between the Open and the Close (Close is higher)", "The range between the High and the Low"],
          correctIndex: 2
        },
        {
          question: "What do the thin lines (wicks/shadows) on a candlestick represent?",
          options: ["The volume of trades", "The average price", "The opening and closing prices", "The highest and lowest prices reached during the period"],
          correctIndex: 3
        }
      ]
    }
  });

  // ---------------------------------------------------------
  // Advanced Path
  // ---------------------------------------------------------
  const advPath = await prisma.learningPath.create({
    data: {
      name: 'Advanced: Portfolio Management',
      description: 'Mastering risk, diversification, and advanced analytics.',
    }
  });

  const aLesson1 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id,
      title: 'The 2% Risk Rule',
      type: 'Simulation',
      content: `### Protecting Your Capital
Professional traders focus on survival first, and profits second. The **2% Rule** is the golden rule of risk management.

**The Rule:** Never risk more than 2% of your total account equity on a single trade.

**How it works in practice:**
If you have a $10,000 account, 2% is $200. This does NOT mean you can only buy $200 worth of stock. It means your **Stop Loss** should be placed so that if the trade goes against you and you are stopped out, you only lose $200.

*Example:* You buy a stock at $50. Your stop loss is at $45. Your risk per share is $5. To risk a maximum of $200, you can buy exactly 40 shares ($200 / $5 = 40). You are deploying $2,000 of capital, but your *risk* is strictly capped at $200.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: aLesson1.id,
      questions: [
        {
          question: "If you have a $50,000 account, what is the maximum amount you should RISK on a single trade according to the 2% rule?",
          options: ["$1,000", "$2,000", "$5,000", "$10,000"],
          correctIndex: 0
        },
        {
          question: "Does risking 2% mean you can only invest 2% of your total cash into a position?",
          options: ["Yes, that is exactly what it means", "No, it means the difference between your entry price and stop-loss price multiplied by position size should not exceed 2% of your account", "Yes, to ensure you have cash left over", "No, it means you should take 2% profit"],
          correctIndex: 1
        }
      ]
    }
  });

  console.log(`✅ Curriculum Generated Successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
