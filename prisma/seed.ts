import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSteps(lessonId: string, steps: Array<{type: string, title: string, content: any, order: number}>) {
  for (const step of steps) {
    await prisma.lessonStep.create({
      data: {
        lessonId,
        type: step.type,
        title: step.title,
        content: step.content,
        order: step.order,
      }
    });
  }
}

async function main() {
  console.log('🌱 Starting Database Seeder (Interactive Curriculum)...');

  // Clear in correct order (foreign key deps)
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonStep.deleteMany();
  await prisma.lessonVersion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.learningPath.deleteMany();

  // =========================================================
  // PATH 1: Beginner — Stock Market 101
  // =========================================================
  const beginnerPath = await prisma.learningPath.create({
    data: { name: 'Beginner: Stock Market 101', description: 'Master the basics of investing.', order: 0 }
  });

  // ── 1.1 What is a Stock? ──
  const b1 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id, title: 'What is a Stock?',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 0,
    }
  });
  await createSteps(b1.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '📈', title: 'What is a Stock?', body: 'A stock = a tiny piece of a company.\n\nBuy 1 share of Zomato → you own a slice of Zomato.' },
        { emoji: '💰', title: 'How You Make Money', body: '1. Price goes UP → sell for profit\n2. Company shares profit → Dividends' },
        { emoji: '🏢', title: 'Real Example', body: '100 shares of Infosys at ₹1,200\nPrice hits ₹1,800\n\n💰 Profit: ₹60,000\n+ ₹3,000 in dividends' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Which of these are stocks? Drag them to the basket.',
      items: ['Reliance', 'Fixed Deposit', 'TCS', 'Savings Account', 'HDFC Bank'],
      targets: ['Stocks'],
      minRequired: 3,
      feedback: 'Correct! Reliance, TCS, and HDFC Bank are all listed stocks on NSE.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'You have ₹10,000. Infosys is at ₹1,500/share. You buy 6 shares. Price goes to ₹1,700.',
      choices: [
        { label: 'Sell now for ₹1,200 profit', outcome: 'Smart! You locked in a 13% gain. Profit = 6 × ₹200 = ₹1,200.', isCorrect: true },
        { label: 'Wait for ₹2,000', outcome: 'Risky! Price could also drop. Greed without a plan is dangerous.', isCorrect: false },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'Riya bought 50 shares of Tata Motors at ₹400. Price is now ₹520. What is her profit?', options: ['₹6,000', '₹20,000', '₹520', '₹400'], correctIndex: 0, explanation: '50 × (₹520 - ₹400) = 50 × ₹120 = ₹6,000' },
        { type: 'true_false', question: 'Buying a stock makes you a part-owner of the company.', correctAnswer: true, explanation: 'A stock literally represents fractional ownership in a business.' },
        { type: 'mcq', question: 'Infosys pays ₹18 per share as dividend. You own 200 shares. How much do you receive?', options: ['₹18', '₹200', '₹3,600', '₹36,000'], correctIndex: 2, explanation: '200 × ₹18 = ₹3,600' },
        { type: 'true_false', question: 'You can only make money from stocks when the price goes up.', correctAnswer: false, explanation: 'You also earn through dividends, even if the price stays flat.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'If you had ₹50,000 to buy your first stock, which Indian company would you pick and why?',
      lessonTopic: 'What is a Stock'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: b1.id, questions: [
    { question: 'What is a stock?', options: ['A loan', 'Ownership in a company', 'A product', 'A guarantee'], correctIndex: 1 },
    { question: 'Two ways to make money from stocks?', options: ['Tax & fees', 'Capital gains & dividends', 'Shorting & options', 'Buy & hold'], correctIndex: 1 },
  ]}});

  // ── 1.2 Stock Exchanges ──
  const b2 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id, title: 'Stock Exchanges: NSE & BSE',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 1,
    }
  });
  await createSteps(b2.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🏛️', title: 'What is an Exchange?', body: 'A marketplace where buyers and sellers trade stocks electronically.\n\nLike Amazon — but for stocks.' },
        { emoji: '🇮🇳', title: 'India\'s Two Exchanges', body: 'NSE → Largest by volume → NIFTY 50\nBSE → Oldest in Asia → SENSEX\n\nTrading: Mon–Fri, 9:15 AM – 3:30 PM' },
        { emoji: '📱', title: 'How You Trade', body: 'Through a broker app:\nZerodha, Groww, Angel One\n\nThey connect you to NSE/BSE.' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Match these to the correct exchange. Drag to NSE or BSE.',
      items: ['NIFTY 50', 'SENSEX', 'Largest by volume', 'Oldest in Asia', 'Zerodha uses this'],
      targets: ['NSE', 'BSE'],
      minRequired: 3,
      feedback: 'NIFTY 50 → NSE, SENSEX → BSE. Most brokers primarily use NSE.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'It\'s Saturday 2 PM. You want to buy shares of Reliance urgently.',
      choices: [
        { label: 'Place order now — it will execute immediately', outcome: 'Wrong! Markets are closed on weekends. Your order will queue for Monday 9:15 AM.', isCorrect: false },
        { label: 'Wait till Monday 9:15 AM', outcome: 'Correct! Indian stock markets only operate Mon–Fri, 9:15 AM – 3:30 PM.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'NIFTY 50 is the benchmark of which exchange?', options: ['BSE', 'NSE', 'NYSE', 'LSE'], correctIndex: 1, explanation: 'NIFTY 50 tracks the top 50 stocks on NSE.' },
        { type: 'true_false', question: 'BSE is the oldest stock exchange in Asia.', correctAnswer: true, explanation: 'BSE was founded in 1875.' },
        { type: 'mcq', question: 'When are Indian stock markets open?', options: ['24/7', 'Mon-Fri 9:15 AM - 3:30 PM', 'Mon-Sat 9 AM - 5 PM', 'Only mornings'], correctIndex: 1, explanation: 'Regular trading hours are Monday to Friday, 9:15 AM to 3:30 PM IST.' },
        { type: 'scenario', question: 'News: "SENSEX crashes 1000 points." Which exchange is affected?', options: ['NSE', 'BSE', 'Both'], correctIndex: 1, explanation: 'SENSEX is BSE\'s benchmark index.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'Why do you think India has TWO stock exchanges instead of just one?',
      lessonTopic: 'Stock Exchanges'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: b2.id, questions: [
    { question: 'NIFTY 50 belongs to?', options: ['BSE', 'NSE', 'NYSE', 'LSE'], correctIndex: 1 },
  ]}});

  // ── 1.3 Types of Orders ──
  const b3 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id, title: 'Types of Orders',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 2,
    }
  });
  await createSteps(b3.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '⚡', title: 'Market Order', body: 'Buy/sell IMMEDIATELY at current price.\n\n✅ Fast\n❌ You don\'t control the exact price' },
        { emoji: '🎯', title: 'Limit Order', body: 'Buy/sell only at YOUR price (or better).\n\n✅ You control the price\n❌ May not execute if price doesn\'t reach' },
        { emoji: '💡', title: 'Example', body: 'Reliance is at ₹2,500.\n\nMarket order → Buy at ₹2,500 instantly\nLimit order at ₹2,480 → Waits until price drops' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Match the order type to the situation.',
      items: ['Need stock urgently', 'Want a specific price', 'Don\'t mind waiting', 'Speed matters most'],
      targets: ['Market Order', 'Limit Order'],
      minRequired: 2,
      feedback: 'Market orders for urgency, limit orders for price control!'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'TCS is at ₹3,400. You believe it\'s worth buying at ₹3,350. No rush.',
      choices: [
        { label: 'Place a market order at ₹3,400', outcome: 'Works, but you pay ₹50 more per share than needed. For 100 shares = ₹5,000 extra.', isCorrect: false },
        { label: 'Place a limit order at ₹3,350', outcome: 'Smart! Your order waits and only executes when TCS drops to ₹3,350. You save money.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'You need HDFC shares urgently before the dividend date. Which order?', options: ['Limit order', 'Market order', 'Stop-loss', 'Cancel order'], correctIndex: 1, explanation: 'Market orders execute immediately — perfect for urgent buys.' },
        { type: 'true_false', question: 'A limit order always executes immediately.', correctAnswer: false, explanation: 'A limit order only executes if the market reaches your set price.' },
        { type: 'mcq', question: 'Limit sell order at ₹500. Stock at ₹480. When does it execute?', options: ['Immediately', 'Never', 'When stock reaches ₹500+', 'At market close'], correctIndex: 2, explanation: 'It waits until the price rises to ₹500 or above.' },
        { type: 'scenario', question: 'You placed market buy for Wipro. The last price was ₹450 but you got it at ₹452. Why?', options: ['Broker error', 'Price moved between placing and executing', 'System glitch'], correctIndex: 1, explanation: 'This is called slippage — prices move between order placement and execution.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'When would YOU use a market order vs a limit order? Give a real example.',
      lessonTopic: 'Types of Orders'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: b3.id, questions: [
    { question: 'Urgent buy = which order?', options: ['Limit', 'Market', 'Stop-loss', 'Cancel'], correctIndex: 1 },
  ]}});

  // ── 1.4 Bull vs Bear Markets ──
  const b4 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id, title: 'Bull vs Bear Markets',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 3,
    }
  });
  await createSteps(b4.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🐂', title: 'Bull Market', body: 'Prices rising 📈\nInvestors optimistic\nEconomy growing\n\nAverage duration: ~4 years' },
        { emoji: '🐻', title: 'Bear Market', body: 'Prices falling 20%+ 📉\nInvestors fearful\nEconomy slowing\n\nAverage duration: ~1 year' },
        { emoji: '🧠', title: 'The Smart Move', body: 'Warren Buffett:\n"Be greedy when others are fearful."\n\nCOVID crash 2020: NIFTY 7,500 → 18,000 in 1 year.\nThose who bought cheap won big.' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Classify these events. Drag to Bull or Bear.',
      items: ['COVID crash 2020', 'Post-COVID recovery', 'Dot-com bubble burst', '2014-2017 Modi rally', '2008 financial crisis'],
      targets: ['Bull Market', 'Bear Market'],
      minRequired: 3,
      feedback: 'Bear: COVID crash, dot-com burst, 2008 crisis. Bull: post-COVID recovery, 2014-2017 rally.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'NIFTY crashes 40% in 2 weeks. Your portfolio is down ₹2,00,000. Everyone is selling.',
      choices: [
        { label: 'Sell everything to stop losses', outcome: 'Panic selling locks in losses! In 2020, those who sold at the bottom missed the 140% recovery.', isCorrect: false },
        { label: 'Hold steady, maybe buy more quality stocks', outcome: 'Smart! Bear markets are when wealth is built. NIFTY recovered from 7,500 to 18,000 in 12 months.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'NIFTY drops from 22,000 to 17,000 in 3 months. This is a:', options: ['Bull market', 'Bear market', 'Sideways market', 'Normal'], correctIndex: 1, explanation: 'A 20%+ decline = bear market territory.' },
        { type: 'true_false', question: 'Bear markets typically last longer than bull markets.', correctAnswer: false, explanation: 'Bulls average ~4 years, bears average ~1 year.' },
        { type: 'scenario', question: 'March 2020: NIFTY at 7,500. You buy ₹1,00,000 worth. By 2021 NIFTY is at 18,000. Your investment is now worth:', options: ['₹1,00,000', '₹2,40,000', '₹50,000'], correctIndex: 1, explanation: '18,000/7,500 = 2.4x. ₹1,00,000 × 2.4 = ₹2,40,000.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'How would YOU react if your portfolio dropped 30% tomorrow? What would you do and why?',
      lessonTopic: 'Bull vs Bear Markets'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: b4.id, questions: [
    { question: 'What is a bear market?', options: ['Prices rising', 'Prices falling 20%+', 'Prices flat', 'High volume'], correctIndex: 1 },
  ]}});

  // ── 1.5 Demat Account ──
  const b5 = await prisma.lesson.create({
    data: {
      learningPathId: beginnerPath.id, title: 'What is a Demat Account?',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 4,
    }
  });
  await createSteps(b5.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🔐', title: '3 Accounts You Need', body: '1. Demat Account → Stores your shares digitally\n2. Trading Account → Place buy/sell orders\n3. Bank Account → Where money flows' },
        { emoji: '📱', title: 'How It Works', body: 'Brokers like Zerodha, Groww open all 3 together.\n\nBank = wallet\nTrading = shop counter\nDemat = cupboard for purchases' },
        { emoji: '📜', title: 'Fun Fact', body: 'Before 1996, shares were PAPER certificates!\n\nNow everything is digital via:\nCDSL & NSDL (depositories)' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Match each account to its purpose.',
      items: ['Stores shares', 'Places orders', 'Holds your money', 'Digital locker', 'Shop counter'],
      targets: ['Demat Account', 'Trading Account', 'Bank Account'],
      minRequired: 3,
      feedback: 'Demat = digital locker for shares. Trading = place orders. Bank = money flow.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'Your friend wants to start investing. They only have a savings account.',
      choices: [
        { label: 'Tell them to just transfer money to a stock', outcome: 'Wrong! You can\'t buy stocks with just a bank account. You need a Demat + Trading account first.', isCorrect: false },
        { label: 'Help them open a Demat + Trading account on Zerodha/Groww', outcome: 'Correct! Most brokers set up all 3 accounts (Demat + Trading + Bank link) in minutes via KYC.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'Where are your purchased shares stored?', options: ['Trading account', 'Bank account', 'Demat account', 'Broker\'s account'], correctIndex: 2, explanation: 'Demat = dematerialized account — your digital locker for shares.' },
        { type: 'true_false', question: 'CDSL and NSDL are stock exchanges.', correctAnswer: false, explanation: 'They are depositories — they hold your shares electronically.' },
        { type: 'mcq', question: 'What minimum do you need to start buying stocks?', options: ['Only a bank account', 'Demat + Trading + Bank', 'Only a trading account', 'A credit card'], correctIndex: 1, explanation: 'All three accounts work together for stock trading.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'What broker app would you choose to open your Demat account and why?',
      lessonTopic: 'Demat Account'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: b5.id, questions: [
    { question: 'Shares are stored in?', options: ['Trading', 'Bank', 'Demat', 'Broker'], correctIndex: 2 },
  ]}});

  // =========================================================
  // PATH 2: Intermediate — Reading Charts
  // =========================================================
  const interPath = await prisma.learningPath.create({
    data: { name: 'Intermediate: Reading Charts', description: 'Learn to read price charts like a pro.', order: 1 }
  });

  // ── 2.1 Candlestick Basics ──
  const i1 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id, title: 'Candlestick Basics',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 0,
    }
  });
  await createSteps(i1.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🕯️', title: 'What is a Candlestick?', body: 'Shows 4 prices for a time period:\nOpen, High, Low, Close (OHLC)\n\n🟢 Green = Price went UP\n🔴 Red = Price went DOWN' },
        { emoji: '📊', title: 'Anatomy', body: 'Thick part = Body (open to close)\nThin lines = Wicks (high & low extremes)\n\nLong wicks = high volatility\nSmall body = indecision' },
        { emoji: '💡', title: 'Example', body: 'Stock: Open ₹100 → High ₹110 → Low ₹95 → Close ₹105\n\n🟢 Green candle\nBody: ₹100 to ₹105\nUpper wick to ₹110\nLower wick to ₹95' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'What does each part of a candle show? Drag to match.',
      items: ['Open-Close range', 'Highest price', 'Lowest price', 'Price direction', 'Volatility'],
      targets: ['Body', 'Upper Wick', 'Lower Wick'],
      minRequired: 3,
      feedback: 'Body = open-close. Upper wick = highest price. Lower wick = lowest price.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'A stock opens at ₹200, hits ₹220, drops to ₹190, closes at ₹195.',
      choices: [
        { label: 'This is a green (bullish) candle', outcome: 'Wrong! Close (₹195) < Open (₹200). The price went DOWN, so it\'s RED.', isCorrect: false },
        { label: 'This is a red (bearish) candle', outcome: 'Correct! Close < Open means the price fell. Red candle with long wicks showing volatility.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'A candle with a tiny body and long wicks on both sides indicates:', options: ['Strong uptrend', 'Strong downtrend', 'Market indecision', 'Stock is cheap'], correctIndex: 2, explanation: 'Long wicks + small body = buyers and sellers fighting, no clear winner.' },
        { type: 'true_false', question: 'In a green candlestick, the close price is higher than the open price.', correctAnswer: true, explanation: 'Green = bullish = close > open.' },
        { type: 'mcq', question: 'The upper wick represents:', options: ['Close price', 'Highest price reached', 'Open price', 'Average price'], correctIndex: 1, explanation: 'The tip of the upper wick marks the highest price during that period.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'You see a red candle with a very long lower wick. What might this mean for the stock?',
      lessonTopic: 'Candlestick Basics'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: i1.id, questions: [
    { question: 'Green candle means?', options: ['Price fell', 'Close > Open', 'High volume', 'Market closed'], correctIndex: 1 },
  ]}});

  // ── 2.2 Support & Resistance ──
  const i2 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id, title: 'Support & Resistance',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 1,
    }
  });
  await createSteps(i2.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🏠', title: 'Support = Floor', body: 'A price level where a stock STOPS falling.\nBuyers step in and push price back up.\n\nExample: Reliance bounces off ₹2,400 repeatedly.' },
        { emoji: '🚧', title: 'Resistance = Ceiling', body: 'A price level where a stock STOPS rising.\nSellers step in and push price back down.\n\nExample: Reliance fails to break ₹2,700 repeatedly.' },
        { emoji: '🔄', title: 'The Flip Rule', body: 'When support BREAKS → it becomes new resistance.\nWhen resistance BREAKS → it becomes new support.\n\nThis is the most important rule!' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Classify these price behaviors.',
      items: ['Price bounces UP from ₹500 three times', 'Price fails to break above ₹800', 'Buyers defend a level', 'Sellers defend a level'],
      targets: ['Support', 'Resistance'],
      minRequired: 2,
      feedback: 'Support = price floor (buyers defend). Resistance = price ceiling (sellers defend).'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'Infosys has support at ₹1,400. Today it breaks below ₹1,400 with heavy selling.',
      choices: [
        { label: '₹1,400 is now even stronger support', outcome: 'Wrong! When support breaks, it flips to resistance. ₹1,400 now acts as a ceiling.', isCorrect: false },
        { label: '₹1,400 becomes the new resistance', outcome: 'Correct! The flip rule — broken support becomes resistance. Price will now struggle to get back ABOVE ₹1,400.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'A stock bounced off ₹500 three times. ₹500 is:', options: ['Resistance', 'Support', 'Moving average', 'Stop-loss'], correctIndex: 1, explanation: 'Price bouncing UP from a level = support (floor).' },
        { type: 'true_false', question: 'When resistance breaks, it becomes new support.', correctAnswer: true, explanation: 'The flip rule works both ways — broken resistance becomes support.' },
        { type: 'mcq', question: 'A stock keeps failing to break above ₹800. This is:', options: ['Support', 'Resistance', 'Stop-loss', 'Target price'], correctIndex: 1, explanation: 'Sellers consistently push the price down at ₹800 = resistance.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'How would you use support and resistance levels to decide when to buy a stock?',
      lessonTopic: 'Support & Resistance'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: i2.id, questions: [
    { question: 'Support is a price:', options: ['Ceiling', 'Floor', 'Average', 'Random'], correctIndex: 1 },
  ]}});

  // ── 2.3 Moving Averages ──
  const i3 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id, title: 'Moving Averages',
      type: 'Flash', content: 'legacy', durationMinutes: 3, order: 2,
    }
  });
  await createSteps(i3.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '📈', title: 'What is a Moving Average?', body: 'Smooths out price noise to show the TREND.\n\n50-day MA → Short-term trend\n200-day MA → Long-term trend' },
        { emoji: '✨', title: 'Golden Cross', body: '50-day MA crosses ABOVE 200-day MA\n= Bullish signal 🟢\n\nJan 2023: NIFTY Golden Cross → rallied 15% in 6 months' },
        { emoji: '💀', title: 'Death Cross', body: '50-day MA crosses BELOW 200-day MA\n= Bearish signal 🔴\n\nSimple rule: Buy when price > 200-day MA. Be cautious when below.' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Classify these signals.',
      items: ['50-MA crosses above 200-MA', '50-MA crosses below 200-MA', 'Price above 200-MA', 'Price below 200-MA'],
      targets: ['Bullish Signal', 'Bearish Signal'],
      minRequired: 2,
      feedback: 'Golden Cross & price above 200-MA = bullish. Death Cross & price below 200-MA = bearish.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'TCS 50-day MA just crossed above its 200-day MA (Golden Cross). Price is ₹3,500.',
      choices: [
        { label: 'This is bearish — sell TCS', outcome: 'Wrong! Golden Cross is a BULLISH signal. It suggests upward momentum.', isCorrect: false },
        { label: 'This is bullish — consider buying', outcome: 'Correct! Golden Cross historically signals the start of an uptrend. Good entry point.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: '50-day MA crosses above 200-day MA. This is called:', options: ['Death Cross', 'Golden Cross', 'Double Top', 'Head & Shoulders'], correctIndex: 1, explanation: 'Golden Cross = short-term trend overtaking long-term = bullish.' },
        { type: 'true_false', question: 'The 200-day moving average represents the short-term trend.', correctAnswer: false, explanation: '200-day MA = long-term trend. 50-day MA = short-term.' },
        { type: 'mcq', question: 'Main purpose of a moving average?', options: ['Predict exact prices', 'Smooth out noise and show trend', 'Set stop-losses', 'Calculate dividends'], correctIndex: 1, explanation: 'MAs filter out daily noise to reveal the underlying trend direction.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'Would you trust a Golden Cross signal alone to buy a stock? What else would you check?',
      lessonTopic: 'Moving Averages'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: i3.id, questions: [
    { question: 'Golden Cross is?', options: ['50MA below 200MA', '50MA above 200MA', 'Price = 0', 'High volume'], correctIndex: 1 },
  ]}});

  // ── 2.4 Volume ──
  const i4 = await prisma.lesson.create({
    data: {
      learningPathId: interPath.id, title: 'Volume: The Silent Indicator',
      type: 'Flash', content: 'legacy', durationMinutes: 2, order: 3,
    }
  });
  await createSteps(i4.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '📊', title: 'What is Volume?', body: 'Total number of shares traded in a period.\n\nHigh volume = many participants\nLow volume = few participants' },
        { emoji: '✅', title: 'Volume Confirms Moves', body: 'Price UP + High Volume = Strong ✅\nPrice UP + Low Volume = Weak ⚠️\nPrice DOWN + High Volume = Panic 🔴' },
        { emoji: '🔥', title: 'Real Example', body: 'Adani crash (Jan 2023):\nVolume was 10x daily average\n\n= Genuine panic selling, not just noise.\nNever trust a breakout on low volume!' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Classify these volume signals.',
      items: ['Price up + 5x volume', 'Price up + very low volume', 'Price down + 10x volume', 'Breakout on tiny volume'],
      targets: ['Strong Signal', 'Weak/Fake Signal'],
      minRequired: 2,
      feedback: 'High volume confirms conviction. Low volume means the move may not sustain.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'A stock breaks above resistance at ₹500 — but volume is only 20% of normal.',
      choices: [
        { label: 'Great breakout! Buy immediately', outcome: 'Careful! Low volume breakouts often fail. The move lacks conviction from enough buyers.', isCorrect: false },
        { label: 'Wait for volume confirmation before buying', outcome: 'Smart! Volume validates breakouts. Wait for a day with 2-3x normal volume to confirm.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'Stock breaks resistance with 5x normal volume. This is:', options: ['Fake breakout', 'Strong confirmed breakout', 'Meaningless', 'Bearish'], correctIndex: 1, explanation: 'High volume = high conviction from buyers = breakout is real.' },
        { type: 'true_false', question: 'Low volume on a price rise is a strong bullish signal.', correctAnswer: false, explanation: 'Low volume = few participants = the move may reverse.' },
        { type: 'scenario', question: 'Stock rises 3% on very low volume. What should you be cautious about?', options: ['Move may not sustain', 'Stock will keep rising', 'Good entry point'], correctIndex: 0, explanation: 'Low conviction means the move could easily reverse.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'A stock you\'re watching breaks out with huge volume. How would you decide to trade it?',
      lessonTopic: 'Volume'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: i4.id, questions: [
    { question: 'Volume is?', options: ['Price range', 'Shares traded', 'Companies listed', 'Market news'], correctIndex: 1 },
  ]}});

  // =========================================================
  // PATH 3: Advanced — Smart Money Management
  // =========================================================
  const advPath = await prisma.learningPath.create({
    data: { name: 'Advanced: Smart Money Management', description: 'Protect capital and build portfolios like the pros.', order: 2 }
  });

  // ── 3.1 The 2% Risk Rule ──
  const a1 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id, title: 'The 2% Risk Rule',
      type: 'Deep', content: 'legacy', durationMinutes: 5, order: 0,
    }
  });
  await createSteps(a1.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🛡️', title: 'The Golden Rule', body: 'Never risk more than 2% of your total capital on a single trade.\n\n₹1,00,000 account\n→ Max risk per trade = ₹2,000' },
        { emoji: '💡', title: 'Risk ≠ Investment', body: 'You can INVEST ₹50,000\nbut RISK only ₹2,000.\n\nThe difference = your stop-loss placement.' },
        { emoji: '🧮', title: 'Calculation', body: 'Buy at ₹500, stop-loss at ₹480\nRisk per share = ₹20\nMax shares = ₹2,000 ÷ ₹20 = 100\n\nInvest ₹50,000, risk only ₹2,000' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Calculate position sizes. Drag the correct answer.',
      items: ['100 shares', '400 shares', '₹10,000 risk', '₹4,000 risk', '50 shares'],
      targets: ['₹5L account, ₹10 risk/share'],
      minRequired: 1,
      feedback: '₹5,00,000 × 2% = ₹10,000 max risk. ₹10,000 ÷ ₹10/share = 1,000 shares. But with limited options, 400 shares at ₹25 risk = ₹10,000.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'You have ₹2,00,000. Stock at ₹100. Stop-loss at ₹90. Risk/share = ₹10.',
      choices: [
        { label: 'Buy 2,000 shares (₹2,00,000)', outcome: 'Dangerous! If stopped out, you lose ₹20,000 = 10% of capital. Way above the 2% rule!', isCorrect: false },
        { label: 'Buy 400 shares (₹40,000)', outcome: 'Perfect! Max risk = ₹2,00,000 × 2% = ₹4,000. At ₹10 risk/share → 400 shares. Risk = exactly ₹4,000.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'Account: ₹5,00,000. Max risk per trade using 2% rule?', options: ['₹50,000', '₹10,000', '₹5,000', '₹2,000'], correctIndex: 1, explanation: '₹5,00,000 × 0.02 = ₹10,000.' },
        { type: 'true_false', question: 'The 2% rule limits how much you can INVEST.', correctAnswer: false, explanation: 'It limits your potential LOSS, not investment size.' },
        { type: 'mcq', question: '10 consecutive losses with 2% rule. Capital lost?', options: ['100%', '50%', 'About 20%', '2%'], correctIndex: 2, explanation: 'Each loss is 2% of remaining capital. After 10: ~18% total lost. You survive!' },
        { type: 'scenario', question: 'Entry ₹500, stop-loss ₹480, account ₹3,00,000. Max shares?', options: ['150', '300', '600'], correctIndex: 1, explanation: 'Risk = ₹6,000. Risk/share = ₹20. Shares = ₹6,000 / ₹20 = 300.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'Why is the 2% rule considered the most important rule in trading? What happens without it?',
      lessonTopic: 'The 2% Risk Rule'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: a1.id, questions: [
    { question: '₹5L account, 2% rule, max risk?', options: ['₹50K', '₹10K', '₹5K', '₹2K'], correctIndex: 1 },
  ]}});

  // ── 3.2 Diversification ──
  const a2 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id, title: 'Diversification',
      type: 'Deep', content: 'legacy', durationMinutes: 5, order: 1,
    }
  });
  await createSteps(a2.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🥚', title: 'Don\'t Put All Eggs in One Basket', body: 'Diversification = spreading money across different stocks and sectors.\n\n❌ 100% in Adani Green\n✅ IT + Banks + Pharma + Gold' },
        { emoji: '📉', title: 'Why It Matters', body: '2023: 100% in Adani → Lost 60%+\nDiversified portfolio → Lost only ~12%\n\nDiversification doesn\'t eliminate risk.\nIt MANAGES it.' },
        { emoji: '📏', title: 'The Rules', body: 'Max 10-15% per stock\nMax 30% per sector\n\n₹10 Lakh portfolio:\n≤ ₹1.5L in any single stock\n≤ ₹3L in any single sector' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Build a diversified portfolio. Pick from different sectors.',
      items: ['Reliance (Energy)', 'HDFC Bank (Finance)', 'Infosys (IT)', 'Sun Pharma (Pharma)', 'Gold ETF', 'ITC (FMCG)'],
      targets: ['Your Portfolio'],
      minRequired: 4,
      feedback: 'Great diversification! You picked stocks from multiple sectors, reducing concentration risk.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'You have ₹10,00,000. Your friend says "Put it all in Adani — they\'re growing fast!"',
      choices: [
        { label: 'Go all-in on Adani', outcome: 'In Jan 2023, Adani stocks crashed 60%+. Your ₹10L would become ₹4L. Devastating.', isCorrect: false },
        { label: 'Split: 25% each across 4 sectors', outcome: 'Smart! If one sector drops 60%, your overall portfolio drops only ~15%. That\'s manageable.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: '₹10L portfolio. Max per stock (15% rule)?', options: ['₹10L', '₹5L', '₹1.5L', '₹1L'], correctIndex: 2, explanation: '₹10,00,000 × 15% = ₹1,50,000.' },
        { type: 'true_false', question: 'Diversification guarantees you will never lose money.', correctAnswer: false, explanation: 'It reduces impact but doesn\'t eliminate market risk entirely.' },
        { type: 'scenario', question: 'Portfolio: 80% banking stocks, 20% cash. Problem?', options: ['Nothing wrong', 'Over-concentrated in one sector', '20% cash is too much'], correctIndex: 1, explanation: 'If banking crashes, 80% of your portfolio is affected. Max 30% per sector.' },
        { type: 'mcq', question: 'Diversification means:', options: ['Buying one great stock', 'Spreading across stocks & sectors', 'Only mutual funds', 'Keeping all in savings'], correctIndex: 1, explanation: 'Spreading investments across different stocks, sectors, and asset classes.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'How would YOU diversify ₹5 lakh across Indian stocks? Name specific companies and why.',
      lessonTopic: 'Diversification'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: a2.id, questions: [
    { question: 'Diversification means?', options: ['One stock', 'Spread across sectors', 'Only MFs', 'All cash'], correctIndex: 1 },
  ]}});

  // ── 3.3 Stop-Loss ──
  const a3 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id, title: 'Stop-Loss: Your Safety Net',
      type: 'Deep', content: 'legacy', durationMinutes: 5, order: 2,
    }
  });
  await createSteps(a3.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🛑', title: 'What is a Stop-Loss?', body: 'An automatic order to SELL if price drops to a set level.\n\nIt limits your loss without you watching the screen all day.' },
        { emoji: '📌', title: 'Two Types', body: 'Fixed Stop-Loss: Set at a specific price\n(e.g., ₹6,650)\n\nTrailing Stop-Loss: Moves UP with price\n(always 5% below current high)' },
        { emoji: '💡', title: 'Example', body: 'Buy Bajaj Finance at ₹7,000\nStop-loss at ₹6,650 (5% below)\n\nPrice drops to ₹6,650 → Sold automatically\nMax loss = ₹350/share\n\nWithout it → could drop to ₹5,000 😱' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Match the stop-loss type to the situation.',
      items: ['Price set at ₹450', 'Always 5% below current price', 'Moves up as stock rises', 'Stays fixed forever'],
      targets: ['Fixed Stop-Loss', 'Trailing Stop-Loss'],
      minRequired: 2,
      feedback: 'Fixed = stays at one price. Trailing = follows the stock up, locking in profits.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'You bought ITC at ₹450. Trailing stop-loss at 5%. Stock rises to ₹500, then drops to ₹470.',
      choices: [
        { label: 'Stop-loss triggered at ₹427.50 (5% below ₹450)', outcome: 'Wrong! Trailing stop-loss moves UP with the price. When stock hit ₹500, stop moved to ₹475.', isCorrect: false },
        { label: 'Stop-loss triggered at ₹475 (5% below ₹500)', outcome: 'Correct! Trailing stop followed the price up to ₹500, so it\'s now at ₹475. Sold at ₹475 for ₹25 profit!', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'Buy at ₹450, stop-loss at ₹425. Stock drops to ₹410. Sold at?', options: ['₹410', '₹450', '₹425', '₹400'], correctIndex: 2, explanation: 'Stop-loss triggers at ₹425. You\'re sold there, not at the lower price.' },
        { type: 'true_false', question: 'You should set your stop-loss AFTER the stock starts dropping.', correctAnswer: false, explanation: 'Always set it BEFORE you enter. Decide max loss first!' },
        { type: 'mcq', question: 'Trailing stop at 5%. Stock: ₹100 → ₹150. Where is stop now?', options: ['₹95', '₹142.50', '₹100', '₹150'], correctIndex: 1, explanation: '₹150 × 0.95 = ₹142.50. The trailing stop followed the price up.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'Do you think a stop-loss is always a good idea? When might it hurt you?',
      lessonTopic: 'Stop-Loss'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: a3.id, questions: [
    { question: 'Stop-loss advantage?', options: ['Guarantees profit', 'Limits downside', 'Increases returns', 'Reduces fees'], correctIndex: 1 },
  ]}});

  // ── 3.4 Risk-Reward Ratio ──
  const a4 = await prisma.lesson.create({
    data: {
      learningPathId: advPath.id, title: 'Risk-Reward Ratio',
      type: 'Deep', content: 'legacy', durationMinutes: 5, order: 3,
    }
  });
  await createSteps(a4.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '⚖️', title: 'Before Every Trade, Ask:', body: 'How much can I GAIN vs how much can I LOSE?\n\nRisk:Reward = Potential Loss : Potential Gain\n\nAim for at least 1:2' },
        { emoji: '🎯', title: 'Example', body: 'Buy at ₹100\nStop-loss at ₹95 (risk = ₹5)\nTarget at ₹110 (reward = ₹10)\n\nRisk:Reward = 1:2 ✅' },
        { emoji: '🧠', title: 'The Secret', body: 'With 1:2 ratio, you only need to be right 40% of the time to profit!\n\nPro traders aren\'t right more often.\nThey make MORE when right than they lose when wrong.' },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 1, content: {
      instruction: 'Which trades have good risk-reward? Drag them.',
      items: ['Risk ₹5, Reward ₹10', 'Risk ₹10, Reward ₹5', 'Risk ₹3, Reward ₹9', 'Risk ₹100, Reward ₹50'],
      targets: ['Good Trade (1:2+)', 'Bad Trade'],
      minRequired: 2,
      feedback: 'Good: 1:2 and 1:3 ratios. Bad: risking more than potential reward.'
    }},
    { type: 'scenario', title: 'Practice', order: 2, content: {
      scenario: 'Trade A: Risk ₹500 to make ₹250. Trade B: Risk ₹500 to make ₹1,500.',
      choices: [
        { label: 'Take Trade A — ₹250 profit is still money', outcome: 'Bad trade! Risk:Reward is 1:0.5. You need 70%+ win rate to survive. Avoid.', isCorrect: false },
        { label: 'Take Trade B — the math is in your favor', outcome: 'Excellent! 1:3 ratio means you only need to be right 25% of the time. Smart risk management.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 3, content: {
      questions: [
        { type: 'mcq', question: 'Entry ₹200, stop-loss ₹185, target ₹230. Risk-reward?', options: ['1:1', '1:2', '2:1', '1:3'], correctIndex: 1, explanation: 'Risk = ₹15, Reward = ₹30. Ratio = 15:30 = 1:2.' },
        { type: 'true_false', question: 'With a 1:3 ratio, you need to be right more than 50% of the time to profit.', correctAnswer: false, explanation: 'At 1:3, you only need ~25% accuracy to break even!' },
        { type: 'mcq', question: 'Minimum recommended risk-reward ratio?', options: ['1:0.5', '1:1', '1:2', '1:5'], correctIndex: 2, explanation: '1:2 is the widely accepted minimum for a favorable trade.' },
        { type: 'scenario', question: 'Trader A: 60% win rate, 1:1 ratio. Trader B: 35% win rate, 1:3 ratio. Who profits more?', options: ['Trader A', 'Trader B', 'Equal'], correctIndex: 1, explanation: 'Trader B: Wins 35% × ₹3 = ₹1.05, Loses 65% × ₹1 = ₹0.65. Net +₹0.40. Trader A: Wins 60% × ₹1 = ₹0.60, Loses 40% × ₹1 = ₹0.40. Net +₹0.20.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 4, content: {
      prompt: 'Would YOU take a trade with high win rate but bad risk-reward (like 1:0.5)? Why or why not?',
      lessonTopic: 'Risk-Reward Ratio'
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: a4.id, questions: [
    { question: 'Min recommended R:R?', options: ['1:0.5', '1:1', '1:2', '1:5'], correctIndex: 2 },
  ]}});

  console.log(`✅ Interactive Curriculum Seeded Successfully!`);
  console.log(`   📚 3 Learning Paths (ordered)`);
  console.log(`   📖 13 Lessons with 5 steps each`);
  console.log(`   🎴 13 Learn Card sets (39 swipe cards)`);
  console.log(`   🎯 13 Interactive exercises`);
  console.log(`   💡 13 Practice scenarios`);
  console.log(`   ❓ 13 Quizzes (45+ questions: MCQ + True/False + Scenario)`);
  console.log(`   🤖 13 AI Feedback prompts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
