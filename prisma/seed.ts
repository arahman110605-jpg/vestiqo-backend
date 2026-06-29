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
    { type: 'simulation', title: 'Try It', order: 2, content: {
      simulationType: 'order_book',
      instructions: 'Try placing both a Market Order and a Limit Order on this live price ticker. Watch how slippage works with market orders vs. the precision of limit orders.',
      learningSummary: 'Market orders fill instantly but with slippage. Limit orders give price control but may not fill if the price never reaches your level.',
      config: { basePrice: 2500, volatility: 15, stockName: 'RELIANCE' }
    }},
    { type: 'chart_scenario', title: 'Scenario', order: 3, content: {
      chartType: 'candlestick',
      scenario: 'TCS is at ₹3,400. You believe it\'s worth buying at ₹3,350. The price has been fluctuating between ₹3,380 and ₹3,420. No rush.',
      chartData: {
        candles: [
          {o:3350,h:3380,l:3330,c:3370},{o:3370,h:3400,l:3360,c:3390},{o:3390,h:3420,l:3375,c:3400},
          {o:3400,h:3430,l:3390,c:3410},{o:3410,h:3425,l:3385,c:3395},{o:3395,h:3410,l:3370,c:3400},
          {o:3400,h:3420,l:3388,c:3405},{o:3405,h:3415,l:3380,c:3390},{o:3390,h:3410,l:3375,c:3402},
        ],
        overlayLines: [
          { price: 3350, label: 'Limit ₹3,350', color: '#F59E0B', isDashed: true },
          { price: 3400, label: 'Current ₹3,400', color: '#F8FAFC', isDashed: false },
        ]
      },
      choices: [
        { label: 'Place a market order at ₹3,400', outcome: 'Works, but you pay ₹50 more per share. For 100 shares = ₹5,000 extra cost!', isCorrect: false },
        { label: 'Place a limit order at ₹3,350', outcome: 'Smart! Your order waits patiently and only fills when TCS drops to ₹3,350. You save ₹50/share.', isCorrect: true },
      ],
      outcomeChartData: {
        candles: [
          {o:3402,h:3405,l:3365,c:3370},{o:3370,h:3375,l:3340,c:3348}
        ],
        overlayLines: [
          { price: 3350, label: '✅ FILLED ₹3,350', color: '#10B981', isDashed: false },
        ]
      }
    }},
    { type: 'quiz', title: 'Quiz', order: 4, content: {
      questions: [
        { type: 'mcq', question: 'You need HDFC shares urgently before the dividend date. Which order?', options: ['Limit order', 'Market order', 'Stop-loss', 'Cancel order'], correctIndex: 1, explanation: 'Market orders execute immediately — perfect for urgent buys.' },
        { type: 'true_false', question: 'A limit order always executes immediately.', correctAnswer: false, explanation: 'A limit order only executes if the market reaches your set price.' },
        { type: 'mcq', question: 'Limit sell order at ₹500. Stock at ₹480. When does it execute?', options: ['Immediately', 'Never', 'When stock reaches ₹500+', 'At market close'], correctIndex: 2, explanation: 'It waits until the price rises to ₹500 or above.' },
        { type: 'scenario', question: 'You placed market buy for Wipro. The last price was ₹450 but you got it at ₹452. Why?', options: ['Broker error', 'Slippage — price moved', 'System glitch'], correctIndex: 1, explanation: 'Slippage — prices move between order placement and execution.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 5, content: {
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
    { type: 'chart_scenario', title: 'See It', order: 1, content: {
      chartType: 'line',
      scenario: 'This is NIFTY 50 from Jan 2020 to Dec 2021. Observe the COVID crash and the recovery that followed. Can you identify the bull and bear phases?',
      chartData: {
        points: [
          {v:12200,label:'Jan 20'},{v:11800},{v:11500},{v:10500},{v:8500},{v:7500,label:'Mar 20'},
          {v:8200},{v:9200},{v:9800,label:'Jun 20'},{v:10500},{v:11200},{v:11500,label:'Sep 20'},
          {v:12200},{v:12800},{v:13500,label:'Dec 20'},{v:14200},{v:14800},{v:15100,label:'Mar 21'},
          {v:14500},{v:15700},{v:15900,label:'Jun 21'},{v:16300},{v:16800},{v:17100,label:'Sep 21'},
          {v:17800},{v:18200,label:'Dec 21'},
        ],
        annotations: [
          { index: 5, label: '🐻 COVID Crash', color: '#EF4444', showAbove: false },
          { index: 14, label: '🐂 Recovery', color: '#10B981', showAbove: true },
        ],
        regions: [
          { start: 0, end: 5, color: '#1AEF4444', label: 'Bear' },
          { start: 5, end: 25, color: '#1A10B981', label: 'Bull' },
        ]
      },
      choices: [
        { label: 'The crash was a good time to sell', outcome: 'Wrong! Panic selling at ₹7,500 means you missed the 140% recovery to ₹18,200.', isCorrect: false },
        { label: 'The crash was a buying opportunity', outcome: 'Correct! Buying at ₹7,500 and holding to ₹18,200 = 142% return. Bear markets create wealth for patient investors.', isCorrect: true },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 2, content: {
      instruction: 'Classify these events. Drag to Bull or Bear.',
      items: ['COVID crash 2020', 'Post-COVID recovery', 'Dot-com bubble burst', '2014-2017 Modi rally', '2008 financial crisis'],
      targets: ['Bull Market', 'Bear Market'],
      minRequired: 3,
      feedback: 'Bear: COVID crash, dot-com burst, 2008 crisis. Bull: post-COVID recovery, 2014-2017 rally.'
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
    { type: 'candlestick_learn', title: 'See It', order: 2, content: { patternId: 'doji' }},
    { type: 'chart_scenario', title: 'Scenario', order: 3, content: {
      chartType: 'candlestick',
      scenario: 'A stock opens at ₹200, hits ₹220, drops to ₹190, closes at ₹195. Look at this candle — is it bullish or bearish?',
      chartData: {
        candles: [
          {o:210,h:215,l:198,c:205},{o:205,h:212,l:200,c:208},{o:208,h:215,l:202,c:204},
          {o:204,h:210,l:196,c:201},{o:201,h:207,l:195,c:200},
          {o:200,h:220,l:190,c:195}
        ]
      },
      choices: [
        { label: 'This is a green (bullish) candle', outcome: 'Wrong! Close (₹195) < Open (₹200). The price went DOWN — it\'s a RED (bearish) candle.', isCorrect: false },
        { label: 'This is a red (bearish) candle', outcome: 'Correct! Close < Open = bearish. Notice the long wicks showing high volatility — buyers tried but sellers won.', isCorrect: true },
      ]
    }},
    { type: 'quiz', title: 'Quiz', order: 4, content: {
      questions: [
        { type: 'mcq', question: 'A candle with a tiny body and long wicks on both sides indicates:', options: ['Strong uptrend', 'Strong downtrend', 'Market indecision', 'Stock is cheap'], correctIndex: 2, explanation: 'Long wicks + small body = buyers and sellers fighting, no clear winner.' },
        { type: 'true_false', question: 'In a green candlestick, the close price is higher than the open price.', correctAnswer: true, explanation: 'Green = bullish = close > open.' },
        { type: 'mcq', question: 'The upper wick represents:', options: ['Close price', 'Highest price reached', 'Open price', 'Average price'], correctIndex: 1, explanation: 'The tip of the upper wick marks the highest price during that period.' },
      ]
    }},
    { type: 'ai_feedback', title: 'Reflect', order: 5, content: {
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
    { type: 'chart_scenario', title: 'S&R Chart', order: 2, content: {
      chartType: 'candlestick',
      scenario: 'Reliance has been bouncing between ₹2,400 (support) and ₹2,700 (resistance). Watch the chart — what happens when support breaks?',
      chartData: {
        candles: [
          {o:2420,h:2460,l:2395,c:2450},{o:2450,h:2500,l:2440,c:2480},{o:2480,h:2530,l:2465,c:2510},
          {o:2510,h:2560,l:2500,c:2550},{o:2550,h:2620,l:2540,c:2600},{o:2600,h:2680,l:2590,c:2670},
          {o:2670,h:2710,l:2650,c:2680},{o:2680,h:2705,l:2640,c:2660},{o:2660,h:2690,l:2620,c:2640},
          {o:2640,h:2660,l:2580,c:2590},{o:2590,h:2610,l:2530,c:2540},
        ],
        overlayLines: [
          { price: 2400, label: 'Support ₹2,400', color: '#10B981', isDashed: true },
          { price: 2700, label: 'Resistance ₹2,700', color: '#EF4444', isDashed: true },
        ]
      },
      choices: [
        { label: '₹2,400 is now even stronger support', outcome: 'Wrong! When support breaks, it flips to resistance. ₹2,400 now acts as a ceiling.', isCorrect: false },
        { label: '₹2,400 becomes the new resistance (flip rule)', outcome: 'Correct! The flip rule — broken support becomes resistance. Price will now struggle to rise back above ₹2,400.', isCorrect: true },
      ],
      outcomeChartData: {
        candles: [
          {o:2540,h:2550,l:2410,c:2430},{o:2430,h:2440,l:2380,c:2390},{o:2390,h:2410,l:2350,c:2360}
        ],
        overlayLines: [
          { price: 2400, label: 'Now Resistance ₹2,400', color: '#EF4444', isDashed: false },
        ]
      }
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
    { type: 'chart_scenario', title: 'Golden Cross', order: 1, content: {
      chartType: 'candlestick',
      scenario: 'TCS chart with 50-day (gold) and 200-day (purple) moving averages. The 50-MA just crossed ABOVE the 200-MA. What does this signal?',
      chartData: {
        candles: [
          {o:3200,h:3230,l:3180,c:3210},{o:3210,h:3250,l:3200,c:3240},{o:3240,h:3270,l:3220,c:3260},
          {o:3260,h:3290,l:3240,c:3280},{o:3280,h:3310,l:3260,c:3300},{o:3300,h:3340,l:3285,c:3330},
          {o:3330,h:3370,l:3320,c:3360},{o:3360,h:3400,l:3345,c:3390},{o:3390,h:3430,l:3380,c:3420},
          {o:3420,h:3460,l:3405,c:3450},{o:3450,h:3490,l:3440,c:3480},{o:3480,h:3520,l:3470,c:3500},
        ],
        lineSeries: [
          { values: [3300,3290,3285,3280,3278,3280,3290,3310,3340,3375,3410,3450], color: '#F59E0B', label: '50-MA', strokeWidth: 2.0 },
          { values: [3310,3305,3300,3298,3296,3294,3293,3293,3295,3298,3302,3310], color: '#7C3AED', label: '200-MA', strokeWidth: 2.0 },
        ]
      },
      choices: [
        { label: 'This is bearish — sell TCS', outcome: 'Wrong! Golden Cross is a BULLISH signal. The short-term trend is overtaking the long-term — momentum is building upward.', isCorrect: false },
        { label: 'This is bullish — consider buying', outcome: 'Correct! Golden Cross (50-MA crossing above 200-MA) historically signals the start of an uptrend. The gold line crossing purple is the key moment.', isCorrect: true },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 2, content: {
      instruction: 'Classify these signals.',
      items: ['50-MA crosses above 200-MA', '50-MA crosses below 200-MA', 'Price above 200-MA', 'Price below 200-MA'],
      targets: ['Bullish Signal', 'Bearish Signal'],
      minRequired: 2,
      feedback: 'Golden Cross & price above 200-MA = bullish. Death Cross & price below 200-MA = bearish.'
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
    { type: 'chart_scenario', title: 'Volume Chart', order: 1, content: {
      chartType: 'candlestick',
      scenario: 'This stock is breaking above resistance at ₹500. But look at the volume bars at the bottom — what do you see?',
      chartData: {
        candles: [
          {o:470,h:480,l:465,c:475},{o:475,h:490,l:472,c:488},{o:488,h:498,l:483,c:495},
          {o:495,h:502,l:490,c:498},{o:498,h:506,l:493,c:503},{o:503,h:510,l:500,c:505},
        ],
        overlayLines: [
          { price: 500, label: 'Resistance ₹500', color: '#EF4444', isDashed: true },
        ],
        volumeData: [120,180,150,90,50,30]
      },
      choices: [
        { label: 'Great breakout! Volume doesn\'t matter', outcome: 'Dangerous! The volume bars are SHRINKING as price rises. This breakout has no conviction — likely to fail.', isCorrect: false },
        { label: 'Weak breakout — volume is declining', outcome: 'Correct! Volume is dropping (120→30) as price breaks out. This is a fake breakout. Real breakouts need 2-3x normal volume.', isCorrect: true },
      ]
    }},
    { type: 'interactive', title: 'Interact', order: 2, content: {
      instruction: 'Classify these volume signals.',
      items: ['Price up + 5x volume', 'Price up + very low volume', 'Price down + 10x volume', 'Breakout on tiny volume'],
      targets: ['Strong Signal', 'Weak/Fake Signal'],
      minRequired: 2,
      feedback: 'High volume confirms conviction. Low volume means the move may not sustain.'
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
    { type: 'calculator', title: 'Calculate', order: 1, content: {
      type: 'position_size',
      scenario: 'You have ₹2,00,000. You want to buy a stock at ₹100 with a stop-loss at ₹90. Use the calculator to find the correct position size using the 2% rule.',
      initialAccountSize: 200000,
      initialEntry: 100,
      initialStopLoss: 90,
      expectedAnswer: { maxShares: 400, maxLoss: 4000 },
      explanation: 'Max risk = ₹2,00,000 × 2% = ₹4,000. Risk/share = ₹100 − ₹90 = ₹10. Max shares = ₹4,000 ÷ ₹10 = 400 shares. Total investment = ₹40,000 (20% of capital).'
    }},
    { type: 'chart_scenario', title: 'Scenario', order: 2, content: {
      chartType: 'candlestick',
      scenario: 'You have ₹2,00,000. Stock at ₹100. Stop-loss at ₹90 (shown on chart). How many shares should you buy?',
      chartData: {
        candles: [
          {o:95,h:100,l:93,c:98},{o:98,h:103,l:96,c:101},{o:101,h:105,l:99,c:103},
          {o:103,h:106,l:100,c:102},{o:102,h:104,l:98,c:100},
        ],
        overlayLines: [
          { price: 100, label: 'Entry ₹100', color: '#F8FAFC', isDashed: false },
          { price: 90, label: 'Stop-Loss ₹90', color: '#EF4444', isDashed: true },
        ]
      },
      choices: [
        { label: 'Buy 2,000 shares (₹2,00,000)', outcome: 'Dangerous! If stopped out, you lose ₹20,000 = 10% of capital. Way above the 2% rule!', isCorrect: false },
        { label: 'Buy 400 shares (₹40,000)', outcome: 'Perfect! Max risk = ₹4,000. At ₹10 risk/share → 400 shares. You invest ₹40,000 but only risk ₹4,000 (2%).', isCorrect: true },
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
    { type: 'simulation', title: 'Crash Sim', order: 2, content: {
      simulationType: 'portfolio_crash',
      instructions: 'This is a diversified portfolio. Tap any sector to simulate a 40-60% crash in that sector. See how diversification protects your total portfolio value.',
      learningSummary: 'When one sector crashes, a diversified portfolio loses only a fraction. 100% in one sector = devastating. Spread across 4-5 sectors = manageable damage.',
      config: {
        centerLabel: '₹10L Portfolio',
        sectors: [
          { name: 'IT', value: 250000, color: '#7C3AED', crashPercent: 45 },
          { name: 'Banking', value: 200000, color: '#3B82F6', crashPercent: 35 },
          { name: 'Pharma', value: 200000, color: '#10B981', crashPercent: 20 },
          { name: 'Energy', value: 200000, color: '#F59E0B', crashPercent: 55 },
          { name: 'Gold', value: 150000, color: '#EAB308', crashPercent: 10 },
        ]
      }
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
    { type: 'simulation', title: 'Simulate', order: 2, content: {
      simulationType: 'trailing_stop',
      instructions: 'Watch the trailing stop-loss in action! Press Play to reveal candles one by one. The red dashed line (stop-loss) moves UP as price rises, but NEVER moves down. When price hits the stop — you\'re sold!',
      learningSummary: 'Trailing stops lock in profits as price rises. They protect gains automatically without you needing to watch the screen. The key insight: the stop never moves DOWN.',
      config: {
        entryPrice: 450,
        initialStopLoss: 427,
        isTrailing: true,
        trailingPercent: 0.05,
        candles: [
          {o:450,h:458,l:445,c:455},{o:455,h:465,l:452,c:462},{o:462,h:475,l:460,c:472},
          {o:472,h:488,l:470,c:485},{o:485,h:502,l:483,c:500},{o:500,h:510,l:495,c:505},
          {o:505,h:512,l:498,c:502},{o:502,h:508,l:490,c:493},{o:493,h:498,l:478,c:480},
          {o:480,h:485,l:470,c:475},{o:475,h:478,l:462,c:465},
        ]
      }
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
    { type: 'calculator', title: 'Calculate R:R', order: 1, content: {
      type: 'risk_reward',
      scenario: 'A stock is at ₹200. You want to set a stop-loss at ₹185 and a target at ₹230. Use the calculator to find the Risk:Reward ratio and decide if this trade is worth taking.',
      initialEntry: 200,
      initialStopLoss: 185,
      initialTarget: 230,
      initialAccountSize: 300000,
      expectedAnswer: { ratio: 2.0 },
      explanation: 'Risk = ₹200 − ₹185 = ₹15/share. Reward = ₹230 − ₹200 = ₹30/share. R:R = 15:30 = 1:2. This is a good trade — you stand to gain 2x what you risk.'
    }},
    { type: 'chart_scenario', title: 'Scenario', order: 2, content: {
      chartType: 'candlestick',
      scenario: 'Two trades shown on charts. Trade A: Risk ₹500, Reward ₹250 (1:0.5). Trade B: Risk ₹500, Reward ₹1,500 (1:3). Which is the better trade?',
      chartData: {
        candles: [
          {o:195,h:202,l:192,c:200},{o:200,h:205,l:197,c:203},{o:203,h:208,l:200,c:205},
          {o:205,h:210,l:202,c:207},{o:207,h:212,l:204,c:210},
        ],
        overlayLines: [
          { price: 200, label: 'Entry ₹200', color: '#F8FAFC', isDashed: false },
          { price: 185, label: 'Stop ₹185 (Risk ₹15)', color: '#EF4444', isDashed: true },
          { price: 230, label: 'Target ₹230 (Reward ₹30)', color: '#10B981', isDashed: true },
        ],
        regions: [
          { start: 0, end: 4, color: '#1A10B981', label: '1:2 R:R' }
        ]
      },
      choices: [
        { label: 'Trade A — ₹250 profit is still money', outcome: 'Bad trade! Risk:Reward is 1:0.5. You need a 70%+ win rate to survive. Most traders can\'t sustain that.', isCorrect: false },
        { label: 'Trade B — the math is in your favor', outcome: 'Excellent! 1:3 ratio means you only need to be right 25% of the time to profit. That\'s the professional approach.', isCorrect: true },
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

  // =========================================================
  // PATH 4: Candlestick Mastery
  // =========================================================
  const candlePath = await prisma.learningPath.create({
    data: { name: 'Candlestick Mastery', description: 'Master all 30 proven candlestick patterns with interactive charts and buy/sell practice.', order: 3 }
  });

  // ── 4.1 Introduction to Candlestick Patterns ──
  const cs1 = await prisma.lesson.create({
    data: {
      learningPathId: candlePath.id, title: 'Introduction to Candlestick Patterns',
      type: 'Flash', content: 'legacy', durationMinutes: 3, order: 0,
    }
  });
  await createSteps(cs1.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🕯️', title: 'Why Candlestick Patterns?', body: 'Candlestick patterns are one of the oldest and most reliable tools for predicting price movements.\n\nInvented in 18th century Japan by rice trader Munehisa Homma.' },
        { emoji: '📊', title: 'How They Work', body: 'Patterns form when candles create recognizable shapes.\n\nThey reveal the PSYCHOLOGY of buyers and sellers — fear, greed, indecision.\n\nPatterns = crowd behavior signals.' },
        { emoji: '🎯', title: 'What You\'ll Learn', body: '🕯️ 11 Single Candle Patterns\n🕯️🕯️ 8 Double Candle Patterns\n🕯️🕯️🕯️ 10 Triple Candle Patterns\n📈 Complex Patterns\n\nEach with visual charts and buy/sell practice!' },
        { emoji: '⚠️', title: 'Important Rule', body: 'No pattern works 100% of the time.\n\nAlways confirm with:\n• Volume\n• Support/Resistance levels\n• Overall market trend\n\nPatterns are SIGNALS, not guarantees.' },
      ]
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: cs1.id, questions: [
    { question: 'Candlestick patterns reveal?', options: ['Stock price', 'Buyer/seller psychology', 'Company news', 'Dividends'], correctIndex: 1 },
  ]}});

  // ── 4.2 Single Candle Patterns ──
  const cs2 = await prisma.lesson.create({
    data: {
      learningPathId: candlePath.id, title: 'Single Candle Patterns',
      type: 'Deep', content: 'legacy', durationMinutes: 8, order: 1,
    }
  });
  const singlePatternIds = ['doji', 'hammer', 'inverted_hammer', 'hanging_man', 'shooting_star', 'bullish_marubozu', 'bearish_marubozu', 'spinning_top', 'dragonfly_doji', 'gravestone_doji', 'long_legged_doji'];
  const singleSteps: Array<{type: string, title: string, content: any, order: number}> = singlePatternIds.map((id, i) => ({
    type: 'candlestick_learn', title: `Pattern: ${id}`, order: i, content: { patternId: id }
  }));
  singleSteps.push({
    type: 'candlestick_practice', title: 'Practice', order: singlePatternIds.length, content: {
      patternIds: ['hammer', 'shooting_star', 'doji', 'bullish_marubozu', 'hanging_man']
    }
  });
  await createSteps(cs2.id, singleSteps);
  await prisma.quiz.create({ data: { lessonId: cs2.id, questions: [
    { question: 'A Hammer appears at?', options: ['Top of uptrend', 'Bottom of downtrend', 'Sideways market', 'Any position'], correctIndex: 1 },
  ]}});

  // ── 4.3 Double Candle Patterns ──
  const cs3 = await prisma.lesson.create({
    data: {
      learningPathId: candlePath.id, title: 'Double Candle Patterns',
      type: 'Deep', content: 'legacy', durationMinutes: 6, order: 2,
    }
  });
  const doublePatternIds = ['bullish_engulfing', 'bearish_engulfing', 'bullish_harami', 'bearish_harami', 'tweezer_tops', 'tweezer_bottoms', 'piercing_line', 'dark_cloud_cover'];
  const doubleSteps: Array<{type: string, title: string, content: any, order: number}> = doublePatternIds.map((id, i) => ({
    type: 'candlestick_learn', title: `Pattern: ${id}`, order: i, content: { patternId: id }
  }));
  doubleSteps.push({
    type: 'candlestick_practice', title: 'Practice', order: doublePatternIds.length, content: {
      patternIds: ['bullish_engulfing', 'bearish_engulfing', 'piercing_line', 'dark_cloud_cover', 'tweezer_tops']
    }
  });
  await createSteps(cs3.id, doubleSteps);
  await prisma.quiz.create({ data: { lessonId: cs3.id, questions: [
    { question: 'Bullish Engulfing is?', options: ['Small green + large red', 'Small red + large green', 'Two red candles', 'Two dojis'], correctIndex: 1 },
  ]}});

  // ── 4.4 Triple Candle Patterns ──
  const cs4 = await prisma.lesson.create({
    data: {
      learningPathId: candlePath.id, title: 'Triple Candle Patterns',
      type: 'Deep', content: 'legacy', durationMinutes: 8, order: 3,
    }
  });
  const triplePatternIds = ['morning_star', 'evening_star', 'three_white_soldiers', 'three_black_crows', 'three_inside_up', 'three_inside_down', 'three_outside_up', 'three_outside_down', 'abandoned_baby_bullish', 'abandoned_baby_bearish'];
  const tripleSteps: Array<{type: string, title: string, content: any, order: number}> = triplePatternIds.map((id, i) => ({
    type: 'candlestick_learn', title: `Pattern: ${id}`, order: i, content: { patternId: id }
  }));
  tripleSteps.push({
    type: 'candlestick_practice', title: 'Practice', order: triplePatternIds.length, content: {
      patternIds: ['morning_star', 'evening_star', 'three_white_soldiers', 'three_black_crows', 'abandoned_baby_bullish']
    }
  });
  await createSteps(cs4.id, tripleSteps);
  await prisma.quiz.create({ data: { lessonId: cs4.id, questions: [
    { question: 'Morning Star signals?', options: ['Bearish reversal', 'Bullish reversal', 'Continuation', 'Indecision'], correctIndex: 1 },
  ]}});

  // ── 4.5 Complex Patterns & Advanced ──
  const cs5 = await prisma.lesson.create({
    data: {
      learningPathId: candlePath.id, title: 'Complex Patterns & Advanced',
      type: 'Deep', content: 'legacy', durationMinutes: 5, order: 4,
    }
  });
  await createSteps(cs5.id, [
    { type: 'candlestick_learn', title: 'Pattern: Rising Three Methods', order: 0, content: { patternId: 'rising_three_methods' } },
    { type: 'candlestick_practice', title: 'Practice', order: 1, content: {
      patternIds: ['rising_three_methods', 'morning_star', 'bullish_engulfing', 'hammer']
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: cs5.id, questions: [
    { question: 'Rising Three Methods is?', options: ['Bearish reversal', 'Bullish continuation', 'Bearish continuation', 'Indecision'], correctIndex: 1 },
  ]}});

  // ── 4.6 Pattern Mastery Challenge ──
  const cs6 = await prisma.lesson.create({
    data: {
      learningPathId: candlePath.id, title: 'Pattern Mastery Challenge',
      type: 'Deep', content: 'legacy', durationMinutes: 5, order: 5,
    }
  });
  await createSteps(cs6.id, [
    { type: 'learn_card', title: 'Learn', order: 0, content: {
      cards: [
        { emoji: '🏆', title: 'Final Challenge', body: 'Time to prove your mastery!\n\nYou\'ll face a mix of all pattern categories — single, double, triple, and complex.\n\nIdentify the pattern AND choose the right action.' },
      ]
    }},
    { type: 'candlestick_practice', title: 'Mastery Challenge', order: 1, content: {
      patternIds: ['hammer', 'bearish_engulfing', 'morning_star', 'shooting_star', 'three_white_soldiers', 'dark_cloud_cover', 'rising_three_methods', 'abandoned_baby_bullish']
    }},
  ]);
  await prisma.quiz.create({ data: { lessonId: cs6.id, questions: [
    { question: 'Best way to confirm a pattern?', options: ['Just trust the shape', 'Volume + support/resistance', 'Ask a friend', 'Wait a week'], correctIndex: 1 },
  ]}});

  console.log(`✅ Interactive Curriculum Seeded Successfully!`);
  console.log(`   📚 4 Learning Paths (ordered)`);
  console.log(`   📖 19 Lessons`);
  console.log(`   🎴 15 Learn Card sets`);
  console.log(`   🎯 13 Interactive exercises`);
  console.log(`   💡 13 Practice scenarios`);
  console.log(`   ❓ 19 Quizzes`);
  console.log(`   🤖 13 AI Feedback prompts`);
  console.log(`   🕯️ 30 Candlestick pattern lessons`);
  console.log(`   📊 6 Candlestick practice rounds`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
