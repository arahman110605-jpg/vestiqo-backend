const fs = require('node:fs');
const path = require('node:path');

const modules = [
  ['Financial Foundations', 'Beginner', ['Money as a Tool','Sources of Income','Needs vs Wants','Fixed and Variable Expenses','Assets','Liabilities','Net Worth','Cash Flow','SMART Financial Goals','Build Your First Money Plan']],
  ['Savings & Banking', 'Beginner', ['Why Save','Pay Yourself First','Emergency Fund Basics','Emergency Fund Sizing','Savings and Current Accounts','How Banks Work','Simple Interest','Compound Interest','Fixed Deposits','Recurring Deposits']],
  ['Debt Management', 'Beginner', ['Good Debt and Bad Debt','How Loans Work','Principal, Rate and Tenure','Understanding EMI','Reducing-Balance Interest','Credit Card Billing Cycle','Minimum Payment Trap','Credit Utilisation','Credit Score','Debt Repayment Strategies']],
  ['Investing Foundations', 'Beginner', ['Why Investing Matters','Risk and Return','Stocks as Ownership','Bonds as Lending','Gold and Commodities','Real Estate and REITs','Cash as an Asset Class','Investment Time Horizon','Power of Compounding','Rule of 72']],
  ['Mutual Funds & ETFs', 'Intermediate', ['Mutual Fund Structure','NAV Explained','Active vs Passive Funds','Index Funds','ETF Basics','SIP','Lump Sum Investing','SWP','Expense Ratio','Tracking Error']],
  ['Stock Market Basics', 'Intermediate', ['NSE and BSE','How an Order Reaches Market','Market and Limit Orders','IPO Journey','Primary and Secondary Markets','Market Participants','Market Capitalisation','Liquidity and Bid-Ask Spread','Bull and Bear Markets','Market Indices and Nifty 50']],
  ['Fundamental Analysis', 'Intermediate', ['Revenue','Operating Profit and Margins','Net Profit','Earnings Per Share','Income Statement','Balance Sheet','Cash Flow Statement','PE Ratio','PB Ratio','ROE and ROCE']],
  ['Portfolio Management', 'Intermediate', ['Why Diversification Works','Asset Allocation','Strategic vs Tactical Allocation','Correlation','Core and Satellite Portfolio','Goal-Based Investing','Portfolio Rebalancing','Retirement Corpus','Withdrawal Planning','Portfolio Review Checklist']],
  ['Risk Management', 'Intermediate', ['Market Risk','Company and Sector Risk','Concentration Risk','Volatility','Drawdown','Position Sizing','Risk-Reward Ratio','Stop-Loss Logic','Sequence-of-Returns Risk','Investment Risk Policy']],
  ['Technical Analysis Foundations', 'Intermediate', ['Price Charts','Chart Timeframes','OHLC Data','Candlestick Anatomy','Volume','Trend Identification','Gaps','Log vs Linear Scale','Chart Context','Technical Analysis Limits']],
  ['Candlestick Mastery', 'Advanced', ['Hammer','Doji','Marubozu','Shooting Star','Bullish Engulfing','Bearish Engulfing','Harami','Piercing Pattern','Morning and Evening Star','Three Soldiers and Three Crows']],
  ['Chart Analysis', 'Advanced', ['Support','Resistance','Trendlines','Channels','Breakouts','False Breakouts','Pullbacks','Range Trading','Multi-Timeframe Analysis','Chart Analysis Playbook']],
  ['Technical Indicators', 'Advanced', ['Simple Moving Average','Exponential Moving Average','Moving Average Crossovers','RSI','RSI Divergence','MACD','Bollinger Bands','VWAP','Average True Range','Indicator Confluence']],
  ['Behavioral Finance', 'Intermediate', ['Fear and Greed','FOMO','Loss Aversion','Confirmation Bias','Anchoring','Overconfidence','Recency Bias','Herd Behaviour','Disposition Effect','Decision Journal']],
  ['Economics for Investors', 'Advanced', ['GDP','Inflation','CPI and WPI','Repo Rate','Monetary Policy','Fiscal Policy','Government Deficit','Unemployment','Business Cycle','Economy-to-Portfolio Map']],
  ['Advanced Investing', 'Advanced', ['Value Investing','Growth Investing','Dividend Investing','Quality Investing','Factor Investing','Moat Analysis','Margin of Safety','Scenario Valuation','Capital Allocation','Investment Thesis and Exit Rules']],
];

const moduleContexts = {
  'Financial Foundations': ['monthly household budget', 'cash-flow board', 'income, spending and saving'],
  'Savings & Banking': ['banking dashboard', 'interest timeline', 'principal, interest and time'],
  'Debt Management': ['loan repayment screen', 'debt meter', 'balance, interest and repayment'],
  'Investing Foundations': ['ten-year wealth timeline', 'risk-return map', 'capital, time and uncertainty'],
  'Mutual Funds & ETFs': ['fund comparison card', 'NAV timeline', 'units, cost and return'],
  'Stock Market Basics': ['live order book', 'market flow diagram', 'buyers, sellers and price'],
  'Fundamental Analysis': ['company scorecard', 'financial statement tiles', 'business performance and price'],
  'Portfolio Management': ['portfolio allocation wheel', 'goal timeline', 'assets, weights and goals'],
  'Risk Management': ['risk cockpit', 'drawdown gauge', 'probability, exposure and loss'],
  'Technical Analysis Foundations': ['interactive price chart', 'OHLC candle', 'price, time and volume'],
  'Candlestick Mastery': ['candle replay chart', 'pattern flashcard', 'open, high, low and close'],
  'Chart Analysis': ['annotatable chart', 'price-zone map', 'trend, level and confirmation'],
  'Technical Indicators': ['indicator workbench', 'signal dashboard', 'price, smoothing and momentum'],
  'Behavioral Finance': ['decision journal', 'bias mirror', 'emotion, evidence and action'],
  'Economics for Investors': ['macro dashboard', 'economic cycle wheel', 'growth, inflation and policy'],
  'Advanced Investing': ['investment committee memo', 'valuation range', 'quality, price and expectations'],
};

const marketCompanies = ['Reliance Industries','HDFC Bank','Infosys','TCS','Nifty 50'];
const interactionCycle = ['match_the_concept','scenario_decision','drag_and_drop','calculator','chart_marking','portfolio_builder','risk_identification','pattern_recognition'];

function slug(value) { return value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function difficulty(moduleDifficulty, index) {
  if (moduleDifficulty === 'Beginner') return index < 7 ? 'Beginner' : 'Intermediate';
  if (moduleDifficulty === 'Intermediate') return index < 7 ? 'Intermediate' : 'Advanced';
  return 'Advanced';
}

function buildLesson(moduleName, moduleIndex, title, index, previousTitle) {
  const [visual, surface, variables] = moduleContexts[moduleName];
  const company = marketCompanies[(moduleIndex + index) % marketCompanies.length];
  const diff = difficulty(modules[moduleIndex][1], index);
  const xp = diff === 'Beginner' ? 40 : diff === 'Intermediate' ? 60 : 80;
  const topic = title.toLowerCase();
  const definition = `${title} is a practical way to understand or manage ${variables}. It helps an investor turn information into a clearer decision instead of relying on instinct alone.`;
  const practiceType = interactionCycle[(moduleIndex * 3 + index) % interactionCycle.length];
  const choices = [
    `Use ${title} with the investor's goal and constraints`,
    `Choose only the option with the highest recent return`,
    'Ignore costs and downside because markets recover',
    'Copy another investor without checking suitability',
  ];
  return {
    id: `m${String(moduleIndex + 1).padStart(2,'0')}-l${String(index + 1).padStart(2,'0')}`,
    moduleName,
    lessonName: title,
    difficulty: diff,
    estimatedDurationMinutes: 3 + (index % 3),
    xpReward: xp,
    prerequisites: previousTitle ? [previousTitle] : moduleIndex ? [modules[moduleIndex - 1][2].at(-1)] : [],
    definition,
    visualUnderstanding: {
      format: visual,
      instruction: `Show ${topic} on a ${surface}. Let the learner change two inputs and immediately see the effect.`,
      example: `Start with ₹1,00,000. Compare two decisions over 5 years, then label which outcome better demonstrates ${topic}.`,
      comparison: `Place a disciplined decision beside an impulse decision; highlight the difference in rupees, percentage and risk.`,
    },
    practiceExercise: {
      type: practiceType,
      prompt: `Apply ${title} to a realistic Indian investor case. Make one decision, then revise it after a new constraint appears.`,
      inputs: ['Goal','Time horizon','Available amount','Risk constraint'],
      successCriteria: [`Decision correctly applies ${title}`,'Reason identifies the key trade-off','Revision responds to the new constraint'],
      feedback: 'Explain the consequence of the choice, reveal the strongest alternative, and allow one retry for full learning XP.',
    },
    quiz: [
      { type:'mcq', question:`Which action best applies ${title}?`, options:choices, correctAnswer:0, explanation:`${title} must be used in context; goals and constraints determine whether a choice is suitable.` },
      { type:'mcq', question:`What is the most useful first input when evaluating ${title}?`, options:['The investor’s objective','A social-media tip','Yesterday’s price move','A guaranteed-return claim'], correctAnswer:0, explanation:'A decision cannot be judged until the objective is clear.' },
      { type:'mcq', question:`Which habit makes ${title} more reliable?`, options:['Use consistent data and a repeatable rule','Change the rule after every loss','Ignore fees and taxes','Judge from one data point'], correctAnswer:0, explanation:'Repeatable rules and consistent evidence reduce avoidable errors.' },
      { type:'scenario', question:`A learner has ₹1,00,000, a five-year goal and moderate risk tolerance. What should they do first when using ${title}?`, options:['Define the constraint and compare suitable choices','Select the highest one-month performer','Put everything into one idea','Wait for a friend’s prediction'], correctAnswer:0, explanation:'The goal, horizon and risk capacity frame the decision.' },
      { type:'scenario', question:`New information increases downside risk. How should the learner respond?`, options:[`Re-evaluate the decision using ${title}`,'Hide the loss from the dashboard','Double the exposure automatically','Keep the plan because it was first'], correctAnswer:0, explanation:'A sound process updates when material evidence or constraints change.' },
      { type:'real_life', question:`Where could an investor observe ${title} in the Indian market?`, options:[`In ${company} or Nifty 50 data and disclosures`,'Only in foreign currency notes','Only after a company delists','Nowhere in public information'], correctAnswer:0, explanation:`Public prices, filings and index data provide a real setting in which to practise ${title}.` },
    ],
    realMarketExample: {
      instrument: company,
      scenario: `Use publicly available ${company} data as a case—not a recommendation. Ask the learner to locate evidence of ${title}, compare two dates or choices, and state what the evidence can and cannot prove.`,
      dataPolicy: 'Use a dated snapshot in production and label all prices and financial figures with source and as-of date.',
    },
    masteryChallenge: {
      title: `${title}: Decision Under Pressure`,
      task: `Solve a three-stage case involving ${company}. Commit to a choice, respond to a market update, and defend the final decision in two sentences.`,
      scoring: { correctApplication:40, reasoning:25, riskAwareness:20, adaptation:15 },
      passScore: 75,
      xpReward: xp * 2,
    },
    aiTutorPrompts: [`Explain ${title} like I am 12.`,`Give me a simple Indian example of ${title}.`,`Quiz me on ${title} without revealing the answer.`,`What mistake do beginners make with ${title}?`],
  };
}

const lessonModules = modules.map(([name, baseDifficulty, titles], moduleIndex) => ({
  id: `module-${String(moduleIndex + 1).padStart(2,'0')}`,
  order: moduleIndex + 1,
  name,
  baseDifficulty,
  submodules: [
    { name:'Understand', lessonIds:titles.slice(0,4).map((_,i)=>`m${String(moduleIndex+1).padStart(2,'0')}-l${String(i+1).padStart(2,'0')}`) },
    { name:'Apply', lessonIds:titles.slice(4,7).map((_,i)=>`m${String(moduleIndex+1).padStart(2,'0')}-l${String(i+5).padStart(2,'0')}`) },
    { name:'Master', lessonIds:titles.slice(7).map((_,i)=>`m${String(moduleIndex+1).padStart(2,'0')}-l${String(i+8).padStart(2,'0')}`) },
  ],
  lessons: titles.map((title,index)=>buildLesson(name,moduleIndex,title,index,index ? titles[index-1] : null)),
  moduleGate: { requiredLessonMastery:80, requiredQuizAccuracy:75, requiredMasteryChallenge:true, retryMode:'targeted remediation' },
}));

const labs = [
  ['Portfolio Builder Lab','Build portfolios that fit goals and constraints',['Single-goal portfolio','Multi-asset allocation','Constraint shock','Committee defence']],
  ['Diversification Lab','See how correlation and concentration change risk',['Two-asset mix','Sector spread','Correlation shock','Diversification audit']],
  ['Risk Lab','Control loss before seeking return',['Risk spotting','Position sizing','Drawdown response','Risk policy']],
  ['Stock Analysis Lab','Turn company evidence into a reasoned view',['Statement hunt','Ratio diagnosis','Peer comparison','Investment memo']],
  ['Candlestick Recognition Lab','Recognise patterns only when context confirms them',['Single candles','Double patterns','Triple patterns','No-pattern traps']],
  ['Chart Drawing Lab','Mark repeatable structures on price charts',['Swing points','Trendlines','Channels','Multi-timeframe map']],
  ['Support & Resistance Lab','Identify zones and test their quality',['Zone marking','Touch scoring','Breakout test','False-break defence']],
  ['Market Replay Lab','Make timestamped decisions without hindsight',['Calm market','Volatility spike','Crash','Recovery']],
  ['Investor Flight Simulator','Run a portfolio through changing regimes',['Take-off plan','Rate shock','Earnings turbulence','Landing review']],
  ['Retirement Planning Simulator','Build and stress-test a retirement plan',['Corpus estimate','Inflation shock','Withdrawal plan','Longevity stress test']],
].map(([name,purpose,levels],i)=>({
  id:`lab-${String(i+1).padStart(2,'0')}`, name, purpose,
  difficulty: i < 3 ? 'Beginner–Intermediate' : i < 7 ? 'Intermediate–Advanced' : 'Advanced',
  levels: levels.map((level,j)=>({ level:j+1, name:level, exercise:`Complete ${level.toLowerCase()} with a new dataset and explain the decision.`, xpReward:100+(j*50) })),
  scoringLogic:{ decisionQuality:35, process:30, riskControl:25, explanation:10, total:100, pass:70 },
  xpRewards:{ firstPass:300, perfectRunBonus:150, noHintBonus:50, dailyReplay:40 },
}));

const licenses = [
  ['Bronze',1,3,55,'Foundations Navigator'],['Silver',1,6,65,'Market Explorer'],['Gold',1,9,75,'Portfolio Builder'],['Platinum',1,13,82,'Investment Analyst'],['Diamond',1,16,90,'Vestiqo Investor'],
].map(([name,start,end,score,title],i)=>({
  name, requirements:[`Master modules ${start}–${end}`,`Complete ${Math.min(i+2,5)} assigned labs`,'No unresolved high-risk simulator violations'],
  lessonsRequired:end*10,
  minimumReadinessScore:score,
  exam:{ questions:25+(i*5), timeMinutes:25+(i*10), passPercent:70+(i*5), domains:`Modules ${start}–${end}`, retakeCooldownHours:24 },
  practicalChallenges:[labs[Math.min(i*2,9)].name,labs[Math.min(i*2+1,9)].name,'Defend one decision to the AI examiner'],
  unlockRewards:[`${title} passport badge`,`${500+(i*500)} bonus XP`,i<4?'Next license path':'Diamond seasonal simulations'],
}));

const systemDesign = {
  learningPath:{ sequence:'Learn → Practice → Quiz → Market Case → Mastery Challenge → Review', unlockRule:'80% lesson mastery and 75% quiz accuracy; failed skills create a 24-hour review mission', dailyLoop:['1 review lesson','1 new lesson','1 practice drill','optional simulator mission'] },
  quizSystem:{ questionMix:{ mcq:3, scenario:2, realLife:1 }, firstPass:75, mastery:90, adaptiveRules:['Repeat a missed skill with changed numbers','Do not repeat identical options','Reduce hint strength after each successful retry','Schedule reviews after 1, 3, 7, 14 and 30 days'] },
  xpSystem:{ lessonComplete:'40/60/80 by difficulty', quizFirstPass:50, perfectQuizBonus:30, masteryChallenge:'80/120/160 by difficulty', streak:'10 XP × day, capped at 70', hintPenalty:'No XP penalty; removes no-hint bonus', antiGrinding:'Only first three same-day repeats earn replay XP' },
  readinessScore:{ formula:'0.25 knowledge + 0.30 applied skill + 0.25 risk discipline + 0.10 consistency + 0.10 recency', knowledge:'adaptive quiz accuracy', appliedSkill:'lab and simulator decisions', riskDiscipline:'position sizing, diversification and rule compliance', consistency:'completion and review reliability', recency:'time-decayed evidence, half-life 60 days', guardrails:['Minimum 50 scored actions','No component may be inferred from reading time','Score capped at 69 until two labs are passed','High-risk rule breach caps risk discipline at 40 until remediation'] },
  portfolioHealth:{ formula:'100 − concentration penalty − volatility mismatch − goal mismatch − liquidity penalty − cost penalty', bands:{ '85-100':'Healthy','70-84':'Watch','50-69':'Needs work','0-49':'High risk' }, inputs:['largest holding and sector weights','asset-class allocation','rolling volatility and drawdown','goal horizon and risk profile','emergency liquidity','estimated product costs'], guidance:'Educational diagnostic only; show assumptions, never issue personalised buy/sell instructions.' },
  recommendedSequence:[...modules.map((m,i)=>`${i+1}. ${m[0]}`),'Capstone: Investor Flight Simulator + license practical'],
};

const curriculum = {
  schemaVersion:'1.0.0', product:'Vestiqo', locale:'en-IN', currency:'INR', generatedAt:'2026-06-23',
  disclaimer:'Educational content only. Examples are not investment advice. Market facts must be refreshed and date-labelled before release.',
  totals:{ modules:lessonModules.length, lessons:lessonModules.reduce((n,m)=>n+m.lessons.length,0), lessonQuizQuestions:lessonModules.reduce((n,m)=>n+m.lessons.reduce((x,l)=>x+l.quiz.length,0),0), labs:labs.length, licenses:licenses.length },
  moduleTree:lessonModules.map(({id,order,name,baseDifficulty,submodules,moduleGate})=>({id,order,name,baseDifficulty,submodules,moduleGate})),
  modules:lessonModules, labs, licenses, systems:systemDesign,
};

const outDir = path.join(__dirname,'..','curriculum');
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'vestiqo-curriculum.json'),JSON.stringify(curriculum,null,2)+'\n');

const md = [`# Vestiqo Complete Curriculum`,``,`Version ${curriculum.schemaVersion} · India-first · ${curriculum.totals.lessons} lessons · ${curriculum.totals.labs} labs`,``,`> ${curriculum.disclaimer}`,``,`## Module and lesson tree`,``];
for (const m of lessonModules) {
  md.push(`### ${m.order}. ${m.name}`,``);
  for (const s of m.submodules) {
    const names=s.lessonIds.map(id=>m.lessons.find(l=>l.id===id).lessonName);
    md.push(`- **${s.name}:** ${names.join(' · ')}`);
  }
  md.push('');
}
md.push('## Learning loop','','Every lesson uses: **Definition → Visual Understanding → Practice → 6-question Quiz → Real Market Example → Mastery Challenge → XP Reward**.','','## Practice systems','');
for (const l of labs) md.push(`- **${l.name}:** ${l.purpose}. Four levels; ${l.scoringLogic.pass}/100 to pass.`);
md.push('','## Investor licenses','');
for (const l of licenses) md.push(`- **${l.name}:** ${l.lessonsRequired} lessons, readiness ${l.minimumReadinessScore}+, ${l.exam.passPercent}% exam pass, practical defence.`);
md.push('','## Product logic','','- Readiness: '+systemDesign.readinessScore.formula+'.','- Portfolio health: '+systemDesign.portfolioHealth.formula+'.','- Reviews: 1, 3, 7, 14 and 30-day spaced retrieval.','- Full lesson content, questions, answer explanations, scoring and prompts are in `vestiqo-curriculum.json`.','');
fs.writeFileSync(path.join(outDir,'README.md'),md.join('\n'));

console.log(`Built ${curriculum.totals.lessons} lessons, ${curriculum.totals.lessonQuizQuestions} questions, ${labs.length} labs and ${licenses.length} licenses.`);
