import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeder (Redesigned Curriculum)...');

  // Clear existing to avoid duplicates
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonVersion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.learningPath.deleteMany();

  // =========================================================
  // PATH 1: Beginner — Stock Market 101
  // =========================================================
  const beginnerPath = await prisma.learningPath.create({
    data: {
      name: 'Beginner: Stock Market 101',
      description: 'Master the absolute basics of investing with real-world examples.',
    }
  });

  // ── Lesson 1.1 ──
  const b1 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id,
      title: 'What is a Stock?',
      type: 'Quick',
      content: `Buying a stock = buying a tiny piece of a company.

Example: If Zomato has 1,000 shares and you buy 1 share, you own 0.1% of Zomato.

You make money two ways:
• Price goes up → you sell for profit (Capital Gain)
• Company shares profit with you → Dividends

Real-world: If you bought 100 shares of Infosys at ₹1,200 in 2020 and it hit ₹1,800 in 2024 → you made ₹60,000 profit, plus ₹3,000+ in dividends.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: b1.id,
      questions: [
        {
          question: "Riya bought 50 shares of Tata Motors at ₹400. The price is now ₹520. How much profit has she made (before selling)?",
          options: ["₹6,000", "₹20,000", "₹520", "₹400"],
          correctIndex: 0
        },
        {
          question: "Infosys pays ₹18 per share as dividend. You own 200 shares. How much do you receive?",
          options: ["₹18", "₹200", "₹3,600", "₹36,000"],
          correctIndex: 2
        },
        {
          question: "If a company has 10 lakh total shares and you own 1,000 shares, what percentage of the company do you own?",
          options: ["1%", "0.1%", "10%", "0.01%"],
          correctIndex: 1
        },
        {
          question: "Which of these is NOT a way to make money from stocks?",
          options: ["Selling at a higher price", "Receiving dividends", "Getting a salary from the company", "All of the above are valid"],
          correctIndex: 2
        }
      ]
    }
  });

  // ── Lesson 1.2 ──
  const b2 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id,
      title: 'Stock Exchanges: NSE & BSE',
      type: 'Quick',
      content: `A stock exchange is a marketplace where buyers and sellers trade stocks electronically.

India has two main exchanges:
• NSE (National Stock Exchange) — Largest by volume. Benchmark: NIFTY 50
• BSE (Bombay Stock Exchange) — Oldest in Asia. Benchmark: SENSEX

Think of it like Amazon for stocks — you don't go to a shop, you place orders online through a broker app (Zerodha, Groww, etc).

Trading hours: Monday–Friday, 9:15 AM to 3:30 PM IST.

Real-world: When people say "market crashed," they mean NIFTY or SENSEX dropped sharply.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: b2.id,
      questions: [
        {
          question: "It's Saturday afternoon. Can you buy stocks on NSE right now?",
          options: ["Yes, markets are 24/7", "No, Indian markets are closed on weekends", "Only if you use a special broker", "Yes, but with extra fees"],
          correctIndex: 1
        },
        {
          question: "NIFTY 50 is the benchmark index of which exchange?",
          options: ["BSE", "NSE", "NYSE", "London Stock Exchange"],
          correctIndex: 1
        },
        {
          question: "What is the role of a stockbroker like Zerodha?",
          options: ["They decide stock prices", "They act as a middleman to place your buy/sell orders on the exchange", "They guarantee you'll make profit", "They own all the stocks"],
          correctIndex: 1
        },
        {
          question: "News headline: 'SENSEX drops 800 points.' Which exchange does this refer to?",
          options: ["NSE", "BSE", "Both equally", "Neither"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 1.3 ──
  const b3 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id,
      title: 'Types of Orders',
      type: 'Quick',
      content: `When you buy/sell a stock, you place an "order." There are different types:

• Market Order — Buy/sell immediately at the current price. Fast but you don't control the exact price.
• Limit Order — Buy/sell only at the price YOU set (or better). You control the price but it may not execute.

Example: Reliance is trading at ₹2,500.
→ Market order: You get it at ₹2,500 (or close) instantly.
→ Limit order at ₹2,480: Your order sits and waits. It only executes if the price drops to ₹2,480.

Pro tip: Use limit orders for expensive stocks to avoid overpaying.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: b3.id,
      questions: [
        {
          question: "TCS is at ₹3,400. You place a limit order to buy at ₹3,350. What happens?",
          options: ["You buy immediately at ₹3,400", "Your order waits until TCS drops to ₹3,350", "The order is rejected", "You buy at ₹3,350 immediately"],
          correctIndex: 1
        },
        {
          question: "You need to buy HDFC Bank shares urgently before a dividend date. Which order type should you use?",
          options: ["Limit order", "Market order", "Stop-loss order", "Cancel order"],
          correctIndex: 1
        },
        {
          question: "You placed a limit order to sell Wipro at ₹500. The stock is currently at ₹480. When will your order execute?",
          options: ["Immediately", "Never", "Only if Wipro reaches ₹500 or above", "At market close"],
          correctIndex: 2
        },
        {
          question: "What is the main trade-off with a market order?",
          options: ["It's slow", "You might pay slightly more or less than expected", "It costs higher brokerage", "It only works on BSE"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 1.4 ──
  const b4 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id,
      title: 'Bull vs Bear Markets',
      type: 'Quick',
      content: `Markets move in cycles:

🐂 Bull Market — Prices rising, investors optimistic, economy growing.
🐻 Bear Market — Prices falling 20%+, investors fearful, economy slowing.

Real-world example:
• 2020 COVID crash → Bear market. NIFTY dropped from 12,000 to 7,500 in weeks.
• 2020–2021 recovery → Bull market. NIFTY shot back up to 18,000.

Key insight: Bear markets are scary but they're when smart investors BUY cheap. Warren Buffett says "Be greedy when others are fearful."

The average bull market lasts ~4 years. The average bear market lasts ~1 year.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: b4.id,
      questions: [
        {
          question: "NIFTY drops from 22,000 to 17,000 over 3 months. What kind of market is this?",
          options: ["Bull market", "Bear market", "Sideways market", "Normal market"],
          correctIndex: 1
        },
        {
          question: "During a bear market, what does Warren Buffett's strategy suggest?",
          options: ["Sell everything immediately", "Stop investing completely", "Look for opportunities to buy good stocks at lower prices", "Move all money to gold"],
          correctIndex: 2
        },
        {
          question: "Which typically lasts longer?",
          options: ["Bear markets", "Bull markets", "They last equal time", "Depends on the country"],
          correctIndex: 1
        },
        {
          question: "In March 2020, NIFTY crashed 40%. An investor who bought at the bottom and held until 2021 would have:",
          options: ["Lost more money", "Roughly doubled their investment", "Broken even", "Made exactly 10%"],
          correctIndex: 1
        },
        {
          question: "What does the 🐂 emoji represent in stock market terminology?",
          options: ["A bear market — prices falling", "A bull market — prices rising", "Market is closed", "High volatility"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 1.5 ──
  const b5 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id,
      title: 'What is a Demat Account?',
      type: 'Quick',
      content: `To buy stocks, you need 3 accounts:

1. Demat Account — Stores your shares digitally (like a digital locker)
2. Trading Account — Used to place buy/sell orders
3. Bank Account — Where your money comes from and goes to

Most brokers (Zerodha, Groww, Angel One) open all three together.

Real-world: Before 1996, shares were physical paper certificates. Now everything is electronic via depositories — CDSL and NSDL.

Think of it like: Bank account = your wallet, Trading account = the shop counter, Demat account = the cupboard where your purchases are stored.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: b5.id,
      questions: [
        {
          question: "Where are your purchased shares stored?",
          options: ["Trading account", "Bank account", "Demat account", "Broker's personal account"],
          correctIndex: 2
        },
        {
          question: "You want to start buying stocks. What's the minimum you need to open?",
          options: ["Only a bank account", "A Demat + Trading + Bank account", "Only a trading account", "A credit card"],
          correctIndex: 1
        },
        {
          question: "CDSL and NSDL are:",
          options: ["Stock exchanges", "Depositories that hold shares electronically", "Government banks", "Types of stocks"],
          correctIndex: 1
        },
        {
          question: "Before 1996, how were shares held in India?",
          options: ["In digital wallets", "As physical paper certificates", "In bank lockers only", "Shares didn't exist before 1996"],
          correctIndex: 1
        }
      ]
    }
  });

  // =========================================================
  // PATH 2: Intermediate — Technical Analysis
  // =========================================================
  const interPath = await prisma.learningPath.create({
    data: {
      name: 'Intermediate: Reading Charts',
      description: 'Learn to read price charts and spot patterns like a pro.',
    }
  });

  // ── Lesson 2.1 ──
  const i1 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id,
      title: 'Candlestick Basics',
      type: 'Quick',
      content: `A candlestick shows 4 prices for a time period: Open, High, Low, Close (OHLC).

🟢 Green candle: Close > Open (price went UP)
🔴 Red candle: Close < Open (price went DOWN)

The thick part = Body (difference between open & close)
The thin lines = Wicks (shows the high & low extremes)

Example: A stock opens at ₹100, goes up to ₹110, drops to ₹95, and closes at ₹105.
→ Green candle. Body from ₹100 to ₹105. Upper wick to ₹110. Lower wick to ₹95.

Long wicks = high volatility. Small body = indecision.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: i1.id,
      questions: [
        {
          question: "A stock opens at ₹200, hits ₹220, drops to ₹190, closes at ₹195. What color is this candle?",
          options: ["Green (bullish)", "Red (bearish)", "White", "No color"],
          correctIndex: 1
        },
        {
          question: "A candle has a very small body but very long wicks on both sides. What does this indicate?",
          options: ["Strong uptrend", "Strong downtrend", "Market indecision / high volatility", "The stock is cheap"],
          correctIndex: 2
        },
        {
          question: "What does the upper wick of a candlestick represent?",
          options: ["The closing price", "The highest price reached during that period", "The opening price", "The average price"],
          correctIndex: 1
        },
        {
          question: "In a green candlestick, which price is higher?",
          options: ["Open price", "Close price", "They are equal", "The low price"],
          correctIndex: 1
        },
        {
          question: "A candle with NO upper or lower wick means:",
          options: ["The market was closed", "The open/close were exactly the high/low for that period", "There was no trading", "The stock price didn't change"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 2.2 ──
  const i2 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id,
      title: 'Support & Resistance',
      type: 'Quick',
      content: `Support = a price level where a stock tends to STOP falling (buyers step in).
Resistance = a price level where a stock tends to STOP rising (sellers step in).

Real-world: Reliance keeps bouncing off ₹2,400 every time it drops there → ₹2,400 is support. It keeps failing to break above ₹2,700 → ₹2,700 is resistance.

Key rule: When support breaks, it often becomes the new resistance (and vice versa).

Think of support as a floor and resistance as a ceiling. The price bounces between them until one breaks.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: i2.id,
      questions: [
        {
          question: "A stock has bounced off ₹500 three times in the past month. ₹500 is acting as:",
          options: ["Resistance", "Support", "A moving average", "A stop-loss"],
          correctIndex: 1
        },
        {
          question: "Infosys breaks below its support level of ₹1,400. According to the key rule, ₹1,400 now becomes:",
          options: ["Stronger support", "Resistance", "Irrelevant", "A buy signal"],
          correctIndex: 1
        },
        {
          question: "A stock keeps failing to break above ₹800. This level is called:",
          options: ["Support", "Resistance", "Stop-loss", "Target price"],
          correctIndex: 1
        },
        {
          question: "Support is best described as:",
          options: ["A price ceiling where sellers dominate", "A price floor where buyers step in", "The average price over 50 days", "The price at which the company was listed"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 2.3 ──
  const i3 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id,
      title: 'Moving Averages',
      type: 'Quick',
      content: `A Moving Average (MA) smooths out price data to show the overall trend direction.

Two common types:
• 50-day MA — Short-term trend
• 200-day MA — Long-term trend

Golden Cross: 50-day MA crosses ABOVE 200-day MA → Bullish signal 🟢
Death Cross: 50-day MA crosses BELOW 200-day MA → Bearish signal 🔴

Real-world: In Jan 2023, NIFTY's 50-day MA crossed above its 200-day MA (Golden Cross). NIFTY then rallied 15% over the next 6 months.

Simple strategy: Buy when price is above the 200-day MA. Be cautious when below.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: i3.id,
      questions: [
        {
          question: "A stock's 50-day MA just crossed above its 200-day MA. This pattern is called:",
          options: ["Death Cross", "Golden Cross", "Double Top", "Head and Shoulders"],
          correctIndex: 1
        },
        {
          question: "TCS is trading below its 200-day moving average. What does this generally suggest?",
          options: ["Strong bullish momentum", "The long-term trend is bearish / cautionary", "It's the best time to buy aggressively", "The stock will definitely go up"],
          correctIndex: 1
        },
        {
          question: "What is the main purpose of a moving average?",
          options: ["To predict exact future prices", "To smooth out noise and show the trend direction", "To set stop-loss levels", "To calculate dividends"],
          correctIndex: 1
        },
        {
          question: "Which moving average represents the long-term trend?",
          options: ["10-day MA", "50-day MA", "200-day MA", "5-day MA"],
          correctIndex: 2
        }
      ]
    }
  });

  // ── Lesson 2.4 ──
  const i4 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id,
      title: 'Volume: The Silent Indicator',
      type: 'Quick',
      content: `Volume = total number of shares traded in a given period.

Why it matters:
• Price UP + High Volume → Strong move, likely to continue ✅
• Price UP + Low Volume → Weak move, might reverse ⚠️
• Price DOWN + High Volume → Strong selling pressure 🔴

Real-world: When Adani stocks crashed in Jan 2023, the volume was 10x the daily average — confirming genuine panic selling, not just noise.

Rule of thumb: Never trust a breakout on low volume. Volume confirms the move.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: i4.id,
      questions: [
        {
          question: "A stock breaks above resistance with 5x normal volume. This is:",
          options: ["A weak signal — probably a fake breakout", "A strong signal — the breakout is confirmed by volume", "Meaningless — volume doesn't matter", "A sign the stock is overvalued"],
          correctIndex: 1
        },
        {
          question: "A stock rises 3% but on very low volume. What should you be cautious about?",
          options: ["The move may not sustain — low conviction from buyers", "It will definitely keep going up", "Low volume always means a good entry point", "You should immediately buy"],
          correctIndex: 0
        },
        {
          question: "During the Adani crash, extremely high volume indicated:",
          options: ["Normal market activity", "Genuine panic selling with strong conviction", "A buying opportunity confirmed by volume", "Technical glitch"],
          correctIndex: 1
        },
        {
          question: "What is volume in stock market terms?",
          options: ["The loudness of market news", "The total number of shares traded in a period", "The price range for the day", "The number of companies listed"],
          correctIndex: 1
        }
      ]
    }
  });

  // =========================================================
  // PATH 3: Advanced — Risk & Portfolio Management
  // =========================================================
  const advPath = await prisma.learningPath.create({
    data: {
      name: 'Advanced: Smart Money Management',
      description: 'Protect your capital and build a portfolio like the pros.',
    }
  });

  // ── Lesson 3.1 ──
  const a1 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id,
      title: 'The 2% Risk Rule',
      type: 'Quick',
      content: `Golden rule: Never risk more than 2% of your total capital on a single trade.

₹1,00,000 account → Max risk per trade = ₹2,000

This does NOT mean you can only invest ₹2,000. It means your LOSS should be capped at ₹2,000.

Example: You buy a stock at ₹500 with a stop-loss at ₹480. Risk per share = ₹20. Max shares = ₹2,000 ÷ ₹20 = 100 shares. You invest ₹50,000 but your risk is strictly ₹2,000.

Why? Even if you're wrong 10 times in a row, you've only lost 20% — you can recover. Without this rule, one bad trade can wipe you out.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: a1.id,
      questions: [
        {
          question: "You have ₹5,00,000. Using the 2% rule, what's the maximum you should risk on one trade?",
          options: ["₹50,000", "₹10,000", "₹5,000", "₹2,000"],
          correctIndex: 1
        },
        {
          question: "Account: ₹2,00,000. Stock price: ₹100. Stop-loss: ₹90. Risk per share: ₹10. Max risk: ₹4,000. How many shares can you buy?",
          options: ["2,000 shares", "400 shares", "100 shares", "40 shares"],
          correctIndex: 1
        },
        {
          question: "Why does the 2% rule focus on risk, not investment size?",
          options: ["Because investing more is illegal", "Because it ensures you survive a losing streak and can recover", "Because stocks only drop 2%", "Because brokers require it"],
          correctIndex: 1
        },
        {
          question: "If you follow the 2% rule and lose 10 trades in a row, how much of your capital is gone?",
          options: ["100%", "50%", "About 20%", "2%"],
          correctIndex: 2
        },
        {
          question: "The 2% rule says you can only INVEST 2% of your capital. True or false?",
          options: ["True", "False — it caps your potential LOSS at 2%, not investment size", "True — it limits position size", "Neither"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 3.2 ──
  const a2 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id,
      title: 'Diversification: Don\'t Put All Eggs in One Basket',
      type: 'Quick',
      content: `Diversification = spreading money across different stocks/sectors to reduce risk.

Bad: 100% of portfolio in one stock (e.g., all in Adani Green)
Good: Split across IT, Banking, Pharma, FMCG sectors

Real-world: In 2023, if you had 100% in Adani stocks, you lost 60%+. But if you had a diversified portfolio (30% IT, 30% Banks, 20% Pharma, 20% Adani), your loss was only ~12%.

Simple rule: No single stock should be more than 10-15% of your total portfolio. No single sector should be more than 30%.

Diversification doesn't eliminate risk — it manages it.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: a2.id,
      questions: [
        {
          question: "You have ₹10,00,000. Following the '15% max per stock' rule, what's the most you should put in one stock?",
          options: ["₹10,00,000", "₹5,00,000", "₹1,50,000", "₹1,00,000"],
          correctIndex: 2
        },
        {
          question: "Your portfolio: 80% banking stocks, 20% cash. What's wrong?",
          options: ["Nothing, banks are safe", "Over-concentrated in one sector — if banking crashes, you lose big", "You should have 100% in banks", "20% cash is too much"],
          correctIndex: 1
        },
        {
          question: "An investor with 100% of their money in Adani Group lost 60% in 2023. A diversified investor lost ~12%. This demonstrates:",
          options: ["Diversification guarantees profits", "Concentration is always better", "Diversification reduces the impact of any single stock's collapse", "Luck plays no role"],
          correctIndex: 2
        },
        {
          question: "Diversification means:",
          options: ["Buying only one really good stock", "Spreading investments across different stocks and sectors", "Investing only in mutual funds", "Keeping all money in a savings account"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 3.3 ──
  const a3 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id,
      title: 'Stop-Loss: Your Safety Net',
      type: 'Quick',
      content: `A stop-loss is a pre-set order that automatically sells your stock if it drops to a certain price — limiting your loss.

Example: You buy Bajaj Finance at ₹7,000. You set a stop-loss at ₹6,650 (5% below). If the price drops to ₹6,650, your shares are sold automatically. Max loss = ₹350 per share.

Without stop-loss: The stock could drop to ₹5,000 and you'd still be holding, hoping for recovery.

Types:
• Fixed stop-loss: Set at a specific price (₹6,650)
• Trailing stop-loss: Moves up as the price rises (always 5% below current price)

Pro tip: Always set a stop-loss BEFORE you enter a trade. Decide how much you can afford to lose first.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: a3.id,
      questions: [
        {
          question: "You buy ITC at ₹450 with a stop-loss at ₹425. The stock drops to ₹410. At what price were your shares sold?",
          options: ["₹410", "₹450", "₹425 (the stop-loss triggered)", "₹400"],
          correctIndex: 2
        },
        {
          question: "A trailing stop-loss is set at 5%. Stock rises from ₹100 to ₹150. Where is your stop-loss now?",
          options: ["₹95 (5% below ₹100)", "₹142.50 (5% below ₹150)", "₹100", "₹150"],
          correctIndex: 1
        },
        {
          question: "What is the biggest advantage of a stop-loss?",
          options: ["It guarantees profit", "It automatically limits your downside risk", "It makes stocks go up", "It reduces brokerage fees"],
          correctIndex: 1
        },
        {
          question: "When should you decide your stop-loss level?",
          options: ["After the stock starts dropping", "Before you enter the trade", "At the end of the trading day", "Stop-losses are optional"],
          correctIndex: 1
        }
      ]
    }
  });

  // ── Lesson 3.4 ──
  const a4 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id,
      title: 'Risk-Reward Ratio',
      type: 'Quick',
      content: `Before every trade, ask: "How much can I gain vs. how much can I lose?"

Risk-Reward Ratio = Potential Loss : Potential Gain

Aim for at least 1:2 (risk ₹1 to make ₹2).

Example: Buy at ₹100, stop-loss at ₹95 (risk = ₹5), target at ₹110 (reward = ₹10). Risk:Reward = 1:2 ✅

With a 1:2 ratio, you only need to be right 40% of the time to be profitable!

Bad trade: Risk ₹10 to make ₹5 (1:0.5) — you need 70%+ win rate to survive.

Pro traders are not right more often. They just make more when they're right than they lose when they're wrong.`
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: a4.id,
      questions: [
        {
          question: "Entry: ₹200, Stop-loss: ₹185, Target: ₹230. What is the risk-reward ratio?",
          options: ["1:1", "1:2", "2:1", "1:3"],
          correctIndex: 1
        },
        {
          question: "With a 1:3 risk-reward ratio, what win rate do you need to be profitable?",
          options: ["More than 75%", "More than 50%", "Only about 25%", "100%"],
          correctIndex: 2
        },
        {
          question: "A trade risks ₹500 to potentially make ₹250. Should you take it?",
          options: ["Yes, any trade is good", "No — the risk-reward (1:0.5) is unfavorable", "Yes, ₹250 profit is still money", "Only on Mondays"],
          correctIndex: 1
        },
        {
          question: "Why can a trader with only 40% accuracy still be profitable?",
          options: ["Because they cheat", "Because they always use leverage", "Because their winning trades earn much more than their losing trades cost", "It's impossible to profit with 40% accuracy"],
          correctIndex: 2
        },
        {
          question: "The MINIMUM risk-reward ratio recommended for most trades is:",
          options: ["1:0.5", "1:1", "1:2", "1:5"],
          correctIndex: 2
        }
      ]
    }
  });

  console.log(`✅ Redesigned Curriculum Seeded Successfully!`);
  console.log(`   📚 3 Learning Paths`);
  console.log(`   📖 13 Bite-sized Lessons`);
  console.log(`   ❓ 55+ Scenario-based Quiz Questions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
