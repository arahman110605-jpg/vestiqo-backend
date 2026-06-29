const fs = require('node:fs');
const path = require('node:path');

const D = 'Beginner';
const I = 'Intermediate';
const A = 'Advanced';

function topic(title, definition, workedExample, decisionRule, commonTrap) {
  return { title, definition, workedExample, decisionRule, commonTrap };
}

const modules = [
  {
    name: 'Financial Foundations',
    difficulty: D,
    outcome: 'Build a working personal-money system before taking investment risk.',
    visual: 'cash-flow board',
    marketAnchor: 'HDFC Bank and RBI consumer-finance material',
    lessons: [
      topic('Money as a Tool', 'Money stores purchasing power and helps people exchange value. Its usefulness comes from what it can fund: daily needs, safety, goals and opportunities.', 'Place ₹10,000 into four jars: ₹5,000 needs, ₹2,000 safety, ₹2,000 goals and ₹1,000 wants.', 'Give every rupee a job before spending it.', 'Treating money as a score or buying things only to impress others'),
      topic('Sources of Income', 'Income is money received from work, business, assets or transfers. Different sources vary in stability, effort, tax treatment and risk.', 'Compare a ₹30,000 salary, ₹5,000 freelance fee and ₹1,000 dividend; label active, variable and asset income.', 'Track each income source by reliability and effort, not just amount.', 'Assuming variable income will arrive every month'),
      topic('Needs vs Wants', 'Needs keep life and work functioning; wants improve comfort or enjoyment. The same purchase can change category depending on a person’s circumstances.', 'Sort ₹12,000 rent, ₹800 medicine, ₹1,500 data plan and ₹4,000 designer shoes into needs and wants.', 'Protect essential needs first and question wants without banning enjoyment.', 'Calling every convenient purchase a need'),
      topic('Fixed and Variable Expenses', 'Fixed expenses are predictable for a period; variable expenses change with use or choice. Knowing both makes a budget easier to control.', 'Compare ₹15,000 rent each month with groceries moving from ₹5,000 to ₹7,000.', 'Plan fixed costs first, then set flexible limits for variable costs.', 'Thinking fixed means permanent or variable means unnecessary'),
      topic('Assets', 'An asset is something you control that has economic value. It may generate income, grow in value or support a future goal.', 'Compare ₹1,00,000 in an FD earning interest with a ₹1,00,000 gadget losing resale value.', 'Judge an asset by cash flow, value, liquidity and purpose.', 'Calling every expensive possession an investment'),
      topic('Liabilities', 'A liability is an obligation that requires future payment. It reduces financial flexibility until principal, interest and fees are cleared.', 'A ₹3,00,000 loan at 12% creates payments; show the balance falling after each EMI.', 'Measure the full payment obligation before accepting a liability.', 'Looking only at the EMI and ignoring total repayment'),
      topic('Net Worth', 'Net worth equals everything you own minus everything you owe. It is a financial snapshot, not a measure of character or monthly income.', 'Assets of ₹8,00,000 minus liabilities of ₹3,00,000 produce net worth of ₹5,00,000.', 'Track net worth consistently using realistic current values.', 'Counting income as an asset before it is earned'),
      topic('Cash Flow', 'Cash flow is money entering and leaving over time. Positive cash flow creates room to save; negative cash flow eventually consumes savings or adds debt.', '₹50,000 enters and ₹44,000 leaves, creating ₹6,000 monthly surplus.', 'Fix recurring cash-flow gaps before chasing investment returns.', 'Using a credit card to hide a monthly deficit'),
      topic('SMART Financial Goals', 'A SMART goal is specific, measurable, achievable, relevant and time-bound. It converts a wish into a target that can be funded and reviewed.', 'Replace “save more” with “build ₹60,000 in 12 months by saving ₹5,000 monthly.”', 'Define amount, date, purpose and monthly contribution.', 'Choosing a target with no deadline or funding plan'),
      topic('Build Your First Money Plan', 'A money plan connects income, essential spending, safety reserves, debt and goals in one repeatable monthly routine.', 'Allocate ₹50,000 as ₹30,000 essentials, ₹5,000 emergency fund, ₹5,000 debt and ₹10,000 goals.', 'Fund safety and high-priority goals automatically after income arrives.', 'Investing aggressively while essential bills or costly debt are unfunded'),
    ],
  },
  {
    name: 'Savings & Banking',
    difficulty: D,
    outcome: 'Use bank products and interest calculations to build reliable financial safety.',
    visual: 'banking timeline',
    marketAnchor: 'HDFC Bank deposit products and RBI banking rules',
    lessons: [
      topic('Why Save', 'Saving moves current income into future use. It protects against shocks and funds short-term goals without forcing a sale or new debt.', 'Saving ₹3,000 monthly creates ₹36,000 before interest in 12 months.', 'Save for known goals and uncertainty before taking avoidable risk.', 'Saving only whatever happens to remain at month-end'),
      topic('Pay Yourself First', 'Pay yourself first means transferring money to savings or investments as soon as income arrives, before discretionary spending begins.', 'Move ₹5,000 from a ₹40,000 salary on day 1 rather than hoping it remains on day 30.', 'Automate a realistic contribution on income day.', 'Setting an amount so high that it must be reversed every month'),
      topic('Emergency Fund Basics', 'An emergency fund is liquid money reserved for necessary, unexpected expenses or income loss. It is insurance against forced borrowing or selling investments.', 'A ₹25,000 medical bill is paid from cash reserves instead of a 36% credit-card balance.', 'Keep emergency money safe, accessible and separate from spending.', 'Investing the emergency fund in volatile assets'),
      topic('Emergency Fund Sizing', 'Emergency-fund size depends on essential monthly costs, income stability, dependants, insurance and access to support. It is usually expressed in months of essentials.', '₹30,000 essential expenses × 6 months gives a ₹1,80,000 target.', 'Choose the number of months from personal risk, then review yearly.', 'Using gross salary instead of essential expenses'),
      topic('Savings and Current Accounts', 'Savings accounts serve individuals and usually pay interest; current accounts prioritise frequent business transactions and may not pay interest.', 'Compare 20 monthly personal transfers with 200 business transactions and choose the suitable account.', 'Match the account type to transaction volume and purpose.', 'Choosing only by promotional interest without checking fees and limits'),
      topic('How Banks Work', 'Banks accept deposits, keep required liquidity and lend part of the funds. They earn mainly from the spread between lending income and funding costs.', 'A bank pays 4% on deposits and lends at 9%; the 5-point gap is not pure profit because costs and defaults remain.', 'Evaluate safety, service, fees and regulation—not only rates.', 'Believing every deposited rupee sits untouched in a vault'),
      topic('Simple Interest', 'Simple interest is calculated only on the original principal. Interest does not itself earn interest.', '₹10,000 at 8% simple interest for 3 years earns ₹2,400.', 'Use principal × rate × time with rate written as a decimal.', 'Adding prior interest to principal in a simple-interest calculation'),
      topic('Compound Interest', 'Compound interest earns returns on both principal and earlier returns. Time and rate make growth accelerate.', '₹10,000 at 10% becomes ₹11,000 after year 1 and ₹12,100 after year 2.', 'Start early and compare products using the same compounding interval.', 'Multiplying the annual interest by years as if growth were linear'),
      topic('Fixed Deposits', 'A fixed deposit locks money with a bank for a chosen tenure at a stated rate. Early withdrawal rules, tax and reinvestment risk affect the result.', 'Compare ₹1,00,000 for 1 year at 7% with an early-withdrawal penalty of 1%.', 'Match FD tenure to the goal date and compare post-tax return.', 'Chasing the highest rate without checking issuer safety'),
      topic('Recurring Deposits', 'A recurring deposit accepts a fixed contribution each month and pays deposit interest. Each instalment earns for a different length of time.', 'Twelve ₹5,000 deposits do not all earn a full year of interest; the first earns longest.', 'Use an RD for predictable short goals requiring monthly discipline.', 'Estimating interest as if all instalments were deposited on day one'),
    ],
  },
  {
    name: 'Debt Management',
    difficulty: D,
    outcome: 'Borrow deliberately, understand repayment maths and escape expensive debt.',
    visual: 'debt repayment meter',
    marketAnchor: 'Indian retail loans, credit cards and credit-bureau reports',
    lessons: [
      topic('Good Debt and Bad Debt', 'Debt is useful when its realistic benefits exceed its full cost and repayment risk. Harmful debt funds consumption without capacity or creates expensive, inflexible payments.', 'Compare a skill loan raising income by ₹8,000 monthly with a 36% card balance for a holiday.', 'Judge purpose, total cost, cash flow and downside before borrowing.', 'Calling all education or home debt automatically good'),
      topic('How Loans Work', 'A lender gives principal now and the borrower repays principal plus interest and fees over time. Collateral, credit risk and tenure influence the terms.', 'Borrow ₹2,00,000 and repay more than ₹2,00,000 through scheduled instalments.', 'Compare annual rate, fees, collateral, tenure and total repayment.', 'Comparing loans only by advertised interest rate'),
      topic('Principal, Rate and Tenure', 'Principal is the amount borrowed, rate is the price of borrowing and tenure is repayment time. All three shape the EMI and total interest.', 'Extend a ₹5,00,000 loan from 3 to 5 years: EMI falls but total interest rises.', 'Choose the shortest affordable tenure with a safety buffer.', 'Choosing a long tenure only because the EMI looks smaller'),
      topic('Understanding EMI', 'An EMI is a fixed periodic loan payment containing interest and principal. Early payments often contain more interest when the reducing-balance method is used.', 'A ₹10,000 EMI is not ₹10,000 of principal; split each payment into interest and principal.', 'Read the amortisation schedule before accepting the EMI.', 'Multiplying EMI by months without adding upfront fees'),
      topic('Reducing-Balance Interest', 'Reducing-balance interest is charged on outstanding principal, so the interest portion declines as principal is repaid.', 'At 12% yearly, a ₹1,00,000 balance costs about ₹1,000 interest for one month; after repayment, the next charge is lower.', 'Compare loans on equivalent reducing-balance rates and total cost.', 'Confusing a flat rate with a reducing-balance rate'),
      topic('Credit Card Billing Cycle', 'A billing cycle groups purchases into a statement with a due date. Paying the full statement balance by the due date normally avoids purchase interest.', 'A purchase just after statement day may receive nearly one cycle more before payment than one just before it.', 'Review the statement and pay the full amount due on time.', 'Thinking the minimum due preserves the interest-free period'),
      topic('Minimum Payment Trap', 'The minimum payment keeps an account from immediate default but leaves most debt accruing high interest. Repayment can then take years.', 'On a ₹50,000 bill, paying ₹2,500 leaves ₹47,500 before interest and new spending.', 'Stop new charges and pay far above the minimum.', 'Treating minimum due as the recommended monthly payment'),
      topic('Credit Utilisation', 'Credit utilisation is card balance divided by available limit. High reported utilisation can signal dependence on credit even when payments are on time.', '₹40,000 used on a ₹1,00,000 limit equals 40% utilisation.', 'Keep balances manageable and avoid spending merely to change a score.', 'Increasing limits to justify unaffordable spending'),
      topic('Credit Score', 'A credit score summarises repayment and borrowing behaviour for lenders. Payment history, utilisation, account age and enquiries can influence it.', 'One missed EMI can matter more than checking your own score; compare the behaviours.', 'Pay on time, use credit lightly and dispute genuine report errors.', 'Paying a company that promises an instant guaranteed score increase'),
      topic('Debt Repayment Strategies', 'Debt avalanche targets the highest interest rate first; debt snowball targets the smallest balance first. Both require minimum payments on every debt.', 'Choose between ₹20,000 at 36% and ₹8,000 at 12%; avalanche attacks 36% first.', 'Use the strategy you can sustain while preventing new debt.', 'Closing a paid card without checking fees, history and future temptation'),
    ],
  },
  {
    name: 'Investing Foundations',
    difficulty: D,
    outcome: 'Connect goals, time, risk and asset behaviour before selecting investments.',
    visual: 'risk-return map',
    marketAnchor: 'Nifty 50, government securities, gold and listed REITs',
    lessons: [
      topic('Why Investing Matters', 'Investing accepts calculated uncertainty to grow purchasing power or produce income over time. It follows safety reserves and depends on a goal.', 'If costs rise 6% yearly, ₹1,00,000 of future purchases may cost about ₹1,79,000 in 10 years.', 'Invest long-term money at risk appropriate to its goal.', 'Investing emergency money because cash returns look low'),
      topic('Risk and Return', 'Higher expected return usually requires accepting more uncertainty or loss. Risk includes not reaching a goal, not only short-term price movement.', 'Compare a certain 6% outcome with a risky range from −20% to +30%.', 'Choose risk from capacity, need and horizon—not excitement.', 'Assuming higher risk guarantees higher return'),
      topic('Stocks as Ownership', 'A share represents fractional ownership in a company. Its value depends on business cash flows, expectations, governance and the price paid.', 'Owning 10 of 1 crore shares is a tiny claim on the company, not a fixed-interest loan.', 'Study the business and valuation before buying ownership.', 'Treating a ticker as a lottery number detached from a business'),
      topic('Bonds as Lending', 'A bond is a loan to an issuer that promises interest and principal under stated terms. Credit risk and changing rates affect its value.', 'A ₹1,000 bond paying 7% offers ₹70 yearly, subject to issuer terms and default risk.', 'Match credit quality and maturity to the goal.', 'Assuming every bond is risk-free'),
      topic('Gold and Commodities', 'Gold and commodities are real assets whose prices respond to supply, demand, currency and risk sentiment. They do not generate business earnings.', 'A 10% gold allocation can behave differently from equities during a shock, but may lag in growth periods.', 'Use commodities for a defined portfolio role, not a return chase.', 'Buying after a sharp rally because the asset feels safe'),
      topic('Real Estate and REITs', 'Real estate offers use, rent and potential appreciation; REITs provide traded exposure to income-producing property. Costs, liquidity and leverage differ.', 'Compare a ₹50 lakh property with a ₹50,000 REIT holding for ticket size and liquidity.', 'Include maintenance, vacancy, taxes, debt and liquidity in comparisons.', 'Counting only headline price appreciation'),
      topic('Cash as an Asset Class', 'Cash and near-cash preserve liquidity and reduce volatility, but inflation can erode purchasing power. Cash is valuable when a goal is near.', '₹2,00,000 needed in 6 months should not depend on a 20% market swing.', 'Hold enough cash for short horizons and known obligations.', 'Calling all cash lazy regardless of its purpose'),
      topic('Investment Time Horizon', 'Time horizon is the period before money is needed. Longer horizons can tolerate more fluctuation; short horizons need greater stability.', 'Compare a 9-month tuition goal with a 25-year retirement goal.', 'Choose asset risk after fixing the goal date.', 'Using age alone as the time horizon for every goal'),
      topic('Power of Compounding', 'Compounding reinvests returns so gains can earn further gains. Its effect strengthens with time, consistency and lower costs.', '₹1 lakh at 12% grows to about ₹3.11 lakh in 10 years before tax and costs.', 'Protect time in the market and avoid interrupting compounding unnecessarily.', 'Projecting a high return as certain every year'),
      topic('Rule of 72', 'The Rule of 72 estimates doubling time: divide 72 by an annual percentage return. It is a shortcut, not a guarantee.', 'At 8%, doubling takes roughly 72 ÷ 8 = 9 years.', 'Use the rule for rough comparison, then calculate precisely.', 'Using nominal return while ignoring inflation, tax and cost'),
    ],
  },
  {
    name: 'Mutual Funds & ETFs',
    difficulty: I,
    outcome: 'Select pooled investments by mandate, cost, tracking and suitability.',
    visual: 'fund comparison dashboard',
    marketAnchor: 'Nifty 50 index funds and exchange-traded ETFs',
    lessons: [
      topic('Mutual Fund Structure', 'A mutual fund pools investors’ money under a stated mandate. An asset manager invests it while the trustee, custodian and regulator provide separate controls.', 'One fund combines ₹1,000 from 10,000 investors into a ₹1 crore pool before costs.', 'Read the mandate, portfolio, risk and costs before selecting a fund.', 'Assuming the fund name guarantees what it will always own'),
      topic('NAV Explained', 'Net asset value per unit equals fund assets minus liabilities, divided by units outstanding. A lower NAV does not mean a fund is cheaper.', '₹102 crore net assets ÷ 10 crore units gives NAV ₹10.20.', 'Compare portfolio value, return and cost—not NAV level alone.', 'Choosing a new fund offer because ₹10 looks cheaper than ₹100'),
      topic('Active vs Passive Funds', 'Active funds try to outperform a benchmark through selection; passive funds aim to track one. Their costs, deviations and manager dependence differ.', 'Compare an active fund charging 1.5% with an index fund charging 0.2% before judging net results.', 'Evaluate active value added after cost and against the correct benchmark.', 'Comparing a small-cap fund with the Nifty 50'),
      topic('Index Funds', 'An index fund holds securities to follow a defined index. It offers rules-based diversification but still carries the index’s market and concentration risks.', 'A Nifty 50 fund mirrors 50 index constituents by the index method, not equal weight by default.', 'Check index construction, expense ratio and tracking difference.', 'Believing index investing removes the chance of loss'),
      topic('ETF Basics', 'An ETF is a pooled fund traded on an exchange during market hours. Its market price can differ slightly from NAV and trading adds spread and brokerage considerations.', 'An ETF quoted ₹200 buy and ₹199.80 sell has a ₹0.20 spread.', 'Check liquidity, spread, tracking and total ownership cost.', 'Using only the last traded price in an illiquid ETF'),
      topic('SIP', 'A systematic investment plan invests a fixed amount on a schedule. It builds discipline and buys more units when NAV is lower, but does not guarantee profit.', '₹5,000 buys 500 units at NAV ₹10 and 400 units at NAV ₹12.50.', 'Tie the SIP amount and fund to a goal, then review periodically.', 'Starting many SIPs without an asset-allocation plan'),
      topic('Lump Sum Investing', 'Lump-sum investing deploys available money at once. Suitability depends on goal horizon, allocation, valuation uncertainty and the investor’s ability to tolerate timing risk.', 'Compare investing ₹1,20,000 today with ₹10,000 monthly for 12 months.', 'Restore target allocation without pretending to predict the exact bottom.', 'Keeping long-term money idle forever while waiting for a perfect entry'),
      topic('SWP', 'A systematic withdrawal plan redeems fund units on a schedule. Withdrawals are not guaranteed income and can exhaust capital, especially after early losses.', 'Withdraw ₹10,000 when NAV is ₹20 by selling 500 units; at NAV ₹16, 625 units are needed.', 'Set withdrawals from a sustainable, diversified plan.', 'Treating every SWP payment as interest earned'),
      topic('Expense Ratio', 'The expense ratio is the annual operating cost charged within a fund. It reduces NAV continuously and compounds into a meaningful long-term difference.', 'On ₹10 lakh, a 1% annual cost is roughly ₹10,000 in year one before balance changes.', 'Compare costs within the same category and mandate.', 'Choosing the cheapest fund without checking tracking or portfolio quality'),
      topic('Tracking Error', 'Tracking error measures variability of a fund’s return difference from its index. Tracking difference measures the actual return gap over a period.', 'If index returns 12% and fund 11.6%, tracking difference is −0.4 percentage points.', 'Review both persistent return gap and variability.', 'Assuming a low expense ratio ensures perfect tracking'),
    ],
  },
  {
    name: 'Stock Market Basics',
    difficulty: I,
    outcome: 'Understand how Indian equity markets, orders and participants work.',
    visual: 'market microstructure map',
    marketAnchor: 'NSE, BSE, Nifty 50 and listed Indian companies',
    lessons: [
      topic('NSE and BSE', 'NSE and BSE are regulated Indian exchanges where listed securities trade electronically. Nifty and Sensex are prominent indices associated with them.', 'Match Nifty 50 to NSE and Sensex to BSE; both markets list many of the same companies.', 'Use an authorised broker and verify the exchange and contract note.', 'Thinking an exchange itself recommends listed shares'),
      topic('How an Order Reaches Market', 'A broker sends an authorised client order to the exchange, where a matching engine pairs compatible bids and offers before clearing and settlement.', 'Trace a 10-share limit order through app, broker, exchange, clearing corporation and demat account.', 'Check order status, price, quantity and final contract note.', 'Assuming an app animation means an order executed'),
      topic('Market and Limit Orders', 'A market order prioritises execution; a limit order prioritises price. Market orders may slip, while limit orders may remain unfilled.', 'With offers at ₹100 and ₹101, a 150-share market buy may fill at more than one price.', 'Use a limit when price control matters and liquidity is uncertain.', 'Assuming a market order fills entirely at the last traded price'),
      topic('IPO Journey', 'An IPO is the first public issue of a company’s shares. Offer documents, price discovery, allotment and listing are separate stages.', 'Applying for 100 shares may result in 0, partial or full allotment before listing.', 'Read the offer document and value the business independently of listing hype.', 'Treating oversubscription as proof of future returns'),
      topic('Primary and Secondary Markets', 'Companies raise capital from investors in the primary market; existing securities trade among investors in the secondary market.', 'IPO money can go to the issuer, while a normal exchange purchase pays the selling investor.', 'Identify who receives the money before interpreting a transaction.', 'Assuming every stock purchase funds the company directly'),
      topic('Market Participants', 'Retail investors, institutions, market makers, brokers, exchanges, clearing corporations and regulators play different roles in a market.', 'Map one trade among buyer, seller, broker, exchange and clearing corporation.', 'Understand incentives and responsibilities before copying another participant.', 'Assuming foreign institutions always know the next price move'),
      topic('Market Capitalisation', 'Market capitalisation equals share price times shares outstanding. It measures equity market value, not company revenue, cash or enterprise value.', '₹500 per share × 100 crore shares equals ₹50,000 crore market cap.', 'Compare market cap with business size and debt using suitable measures.', 'Calling a low share price a small or cheap company'),
      topic('Liquidity and Bid-Ask Spread', 'Liquidity is the ability to trade without large delay or price impact. The bid-ask spread is an immediate cost of crossing between buyers and sellers.', 'A ₹99 bid and ₹101 ask create a ₹2 spread, or about 2% of the midpoint.', 'Inspect volume, depth and spread before placing a large order.', 'Judging liquidity from one day’s volume alone'),
      topic('Bull and Bear Markets', 'Bull markets describe sustained broad rises and confidence; bear markets describe major broad declines and fear. Labels are clearer in hindsight than in real time.', 'A 20% fall from 20,000 reaches 16,000; recovery to 20,000 requires a 25% gain.', 'Keep allocation and risk rules through changing market regimes.', 'Selling everything only after a decline receives a bear-market label'),
      topic('Market Indices and Nifty 50', 'A market index tracks a rules-based basket as a benchmark. Nifty 50 represents large Indian companies using free-float market-cap weighting.', 'A 10% index constituent affects the index more than a 1% constituent for the same price move.', 'Use the correct total-return benchmark for comparison.', 'Treating an index level as the price of one investable share'),
    ],
  },
  {
    name: 'Fundamental Analysis',
    difficulty: I,
    outcome: 'Read financial statements, ratios and valuation as one connected business story.',
    visual: 'company financial scorecard',
    marketAnchor: 'Reliance Industries, HDFC Bank, Infosys and TCS filings',
    lessons: [
      topic('Revenue', 'Revenue is income from a company’s ordinary activities before expenses. Growth quality depends on volume, price, mix, currency and whether sales convert to cash.', 'Revenue rises from ₹100 crore to ₹120 crore, a 20% increase; then inspect receivables and margins.', 'Separate durable operating growth from one-off or acquisition effects.', 'Assuming faster revenue always means higher shareholder value'),
      topic('Operating Profit and Margins', 'Operating profit measures earnings from core operations before financing and tax. Operating margin divides it by revenue to compare efficiency over time.', '₹20 crore operating profit on ₹100 crore revenue gives a 20% margin.', 'Explain margin changes using price, cost, mix and utilisation.', 'Comparing margins across very different industries without context'),
      topic('Net Profit', 'Net profit is what remains after operating costs, interest, tax and other items. One-offs can make reported profit differ from sustainable earning power.', '₹20 crore operating profit minus ₹5 crore interest and tax leaves ₹15 crore net profit.', 'Reconcile profit growth with recurring operations and cash flow.', 'Valuing a company on one exceptional profit year'),
      topic('Earnings Per Share', 'Earnings per share is profit attributable to ordinary shareholders divided by weighted average shares. Dilution can reduce EPS even when total profit grows.', '₹100 crore profit ÷ 10 crore shares equals EPS ₹10.', 'Check diluted EPS, share-count changes and profit quality.', 'Comparing EPS levels between companies as if lower means cheaper'),
      topic('Income Statement', 'The income statement shows revenue, expenses and profit over a period. It explains performance flow but not the full cash or balance-sheet position.', 'Walk ₹100 revenue through ₹60 costs, ₹10 depreciation, ₹5 interest and ₹5 tax to ₹20 profit.', 'Read several years and connect each margin to business drivers.', 'Using revenue growth alone to judge the whole statement'),
      topic('Balance Sheet', 'The balance sheet lists assets, liabilities and equity at a date. It reveals funding, liquidity and capital employed, but values may differ from market values.', 'Assets ₹500 crore equal liabilities ₹300 crore plus equity ₹200 crore.', 'Test liquidity, leverage and asset quality together.', 'Treating book value as guaranteed sale value'),
      topic('Cash Flow Statement', 'The cash flow statement groups cash from operations, investing and financing. It helps test how accounting profit turns into cash.', 'Profit is ₹50 crore but operating cash is ₹20 crore because receivables grew ₹30 crore.', 'Compare operating cash with profit across several periods.', 'Calling negative investing cash automatically bad when productive assets are being built'),
      topic('PE Ratio', 'Price-to-earnings compares share price with earnings per share. It reflects growth, quality, risk and expectations, so a low PE is not automatically cheap.', 'Price ₹600 ÷ EPS ₹30 gives PE 20.', 'Compare normalised earnings and peers with similar economics.', 'Buying the lowest PE without asking why it is low'),
      topic('PB Ratio', 'Price-to-book compares market value with accounting equity. It is most useful when book assets and returns on equity are economically meaningful.', 'Price ₹300 ÷ book value per share ₹200 gives PB 1.5.', 'Interpret PB alongside ROE, asset quality and business model.', 'Using PB as the main valuation tool for asset-light firms'),
      topic('ROE and ROCE', 'ROE measures profit relative to shareholder equity; ROCE measures operating return on long-term capital. Leverage can raise ROE without improving operations.', '₹20 profit on ₹100 equity gives 20% ROE; compare with debt and ROCE.', 'Seek durable returns above capital cost without excessive leverage.', 'Preferring high ROE created only by a tiny debt-funded equity base'),
    ],
  },
  {
    name: 'Portfolio Management',
    difficulty: I,
    outcome: 'Turn goals and constraints into a diversified, maintained portfolio.',
    visual: 'portfolio allocation wheel',
    marketAnchor: 'Nifty 50 funds, government bonds, gold ETFs and cash',
    lessons: [
      topic('Why Diversification Works', 'Diversification combines exposures that do not fail for the same reason at the same time. It reduces avoidable concentration risk but cannot remove market-wide loss.', 'Two equal assets at +10% and −10% leave the pair near 0% before compounding effects.', 'Diversify across risk drivers, not merely ticker count.', 'Owning 20 companies from one sector and calling it diversified'),
      topic('Asset Allocation', 'Asset allocation is the split among equities, bonds, cash, real assets and other exposures. It is a major driver of portfolio risk and goal reliability.', 'Compare 80% equity for a 20-year goal with 20% equity for a 1-year goal.', 'Set allocation from horizon, capacity and required return.', 'Copying an allocation designed for someone else'),
      topic('Strategic vs Tactical Allocation', 'Strategic allocation is the long-term target; tactical allocation makes limited temporary deviations. Tactical moves add timing and discipline risk.', 'A 60% equity target allows a tactical band of 55–65%, not an unbounded bet.', 'Define tactical ranges, evidence and exit rules in advance.', 'Renaming panic selling as tactical allocation'),
      topic('Correlation', 'Correlation describes how returns move together from −1 to +1. It can change during stress and does not prove causation.', 'Combine two assets with correlation 0.2 rather than two funds holding the same stocks at 0.95.', 'Use correlation with volatility, holdings and stress tests.', 'Assuming historical low correlation is permanent'),
      topic('Core and Satellite Portfolio', 'A core-satellite portfolio uses broad, low-cost holdings as the base and smaller focused positions for selected views or goals.', 'Place 80% in a diversified core and cap four satellite ideas at 5% each.', 'Protect the core and set a total satellite risk budget.', 'Letting winning satellites silently become the whole portfolio'),
      topic('Goal-Based Investing', 'Goal-based investing assigns money, horizon, priority and risk to specific outcomes. The suitable portfolio can differ for each goal.', 'Separate ₹5 lakh due in 2 years from retirement money needed in 25 years.', 'Create a target corpus and allocation for each goal.', 'Putting every goal into one portfolio with one risk level'),
      topic('Portfolio Rebalancing', 'Rebalancing restores target allocation by buying lagging assets, selling winners or redirecting contributions. It controls risk rather than forecasting return.', 'A 60:40 portfolio becomes 70:30; rebalance to the allowed band after costs and tax.', 'Use calendar or tolerance-band rules and minimise unnecessary cost.', 'Rebalancing every small daily move'),
      topic('Retirement Corpus', 'A retirement corpus is capital needed to fund inflation-adjusted spending after work income. Longevity, return, inflation and other income shape it.', '₹6 lakh annual spending × 25 gives a rough ₹1.5 crore starting estimate before detailed modelling.', 'Model real spending, lifespan, taxes and margin of safety.', 'Using one simple multiple as a guaranteed answer'),
      topic('Withdrawal Planning', 'Withdrawal planning decides how retirement assets fund spending while managing inflation, market sequence, tax and longevity risk.', 'A 4% first-year withdrawal from ₹1 crore is ₹4 lakh, then needs monitoring and adjustment.', 'Use flexible spending rules, reserves and diversified assets.', 'Assuming the same fixed percentage is safe in every market and country'),
      topic('Portfolio Review Checklist', 'A portfolio review checks goals, allocation, holdings, costs, tax, performance, risk and required actions at a sensible interval.', 'Review a 5% drift, one fund mandate change and a fee rise without reacting to one bad week.', 'Change only when goals, evidence or policy require it.', 'Replacing investments because another product recently ranked first'),
    ],
  },
  {
    name: 'Risk Management',
    difficulty: I,
    outcome: 'Define acceptable loss before committing capital.',
    visual: 'risk cockpit',
    marketAnchor: 'Nifty 50 drawdowns and Indian equity portfolio scenarios',
    lessons: [
      topic('Market Risk', 'Market risk is loss caused by broad changes in prices, rates, growth or sentiment. Diversifying individual companies cannot fully remove it.', 'If Nifty 50 falls 15%, many unrelated shares may decline together.', 'Align total market exposure with goal horizon and loss capacity.', 'Believing ten equity funds eliminate equity market risk'),
      topic('Company and Sector Risk', 'Company risk comes from one firm’s operations or governance; sector risk affects businesses sharing economics, regulation or demand.', 'A bank fraud is company risk; a sector-wide rate shock can affect many banks.', 'Cap single-company and sector exposure before adverse news.', 'Adding several firms from one industry to solve concentration'),
      topic('Concentration Risk', 'Concentration risk is dependence on a small number of holdings, sectors, employers or outcomes. It magnifies both gains and permanent loss.', 'A 40% holding that falls 50% cuts the portfolio by 20% before other moves.', 'Set maximum weights based on downside, not confidence.', 'Keeping an oversized position because its gain created the weight'),
      topic('Volatility', 'Volatility measures variation in returns, commonly through standard deviation. It describes movement, not every form of risk or permanent loss.', 'Compare an asset moving ±2% daily with one moving ±0.3%.', 'Match volatility to horizon and behaviour under loss.', 'Treating low recent volatility as proof of safety'),
      topic('Drawdown', 'Drawdown is the decline from a portfolio peak to a later trough. Recovering from a loss requires a larger percentage gain.', 'A 50% fall needs a 100% gain to return to the starting value.', 'Plan for tolerable drawdown before choosing allocation.', 'Measuring risk only from average annual return'),
      topic('Position Sizing', 'Position sizing sets how much capital goes into an idea based on portfolio risk, entry, exit and uncertainty.', 'Risk ₹1,000 with entry ₹100 and stop ₹95: ₹5 risk per share allows 200 shares before slippage.', 'Size from acceptable loss, then check concentration.', 'Choosing quantity from desired profit'),
      topic('Risk-Reward Ratio', 'Risk-reward compares planned loss with potential gain. It supports consistency but does not include the probability of either outcome.', 'Entry ₹100, stop ₹95 and target ₹110 gives ₹5 risk and ₹10 reward, or 1:2.', 'Combine payoff with evidence, probability and costs.', 'Taking every 1:3 setup regardless of win probability'),
      topic('Stop-Loss Logic', 'A stop-loss is a predefined exit intended to limit loss. Gaps, liquidity and noise mean execution may differ from the stop price.', 'A stop at ₹95 can fill at ₹92 after an overnight gap.', 'Place stops where the thesis fails and size for execution risk.', 'Moving a stop lower solely to avoid admitting error'),
      topic('Sequence-of-Returns Risk', 'Sequence risk means the order of returns matters when money is added or withdrawn. Early retirement losses plus withdrawals can permanently damage a portfolio.', 'Two portfolios average 8%, but the one losing 20% in year 1 while withdrawing fares worse.', 'Use reserves, diversification and flexible withdrawals near retirement.', 'Relying only on long-term average return'),
      topic('Investment Risk Policy', 'An investment risk policy records objectives, allocation ranges, position limits, liquidity needs, review rules and prohibited actions.', 'Write maximum 10% per stock, 30% per sector and six months’ liquidity before investing.', 'Make risk rules measurable and review them after life changes.', 'Changing limits during a loss to excuse the current position'),
    ],
  },
  {
    name: 'Technical Analysis Foundations',
    difficulty: I,
    outcome: 'Read price, time and volume without confusing patterns with certainty.',
    visual: 'interactive OHLC chart',
    marketAnchor: 'dated Nifty 50 and liquid NSE stock charts',
    lessons: [
      topic('Price Charts', 'A price chart arranges market prices over time. Line, bar and candlestick charts show different detail but do not explain business value by themselves.', 'Plot five closes—100, 103, 101, 105, 108—on a line chart.', 'Choose the chart that fits the decision and preserve scale context.', 'Reading a cropped chart without dates or axis'),
      topic('Chart Timeframes', 'A timeframe defines what period each bar represents. The same market can trend up on a weekly chart and down on an hourly chart.', 'Twenty-four hourly candles and one daily candle can describe the same session differently.', 'Use a higher timeframe for context and a lower one for execution.', 'Changing timeframe until a preferred signal appears'),
      topic('OHLC Data', 'OHLC records open, high, low and close for a period. Together they show range and where price finished, not the sequence of every trade.', 'Open 100, high 108, low 97, close 106 creates a ₹11 range and ₹6 body.', 'Read all four values and the period before interpreting a bar.', 'Assuming the high happened before the low'),
      topic('Candlestick Anatomy', 'A candlestick body spans open to close; wicks extend to high and low. Shape summarises one period’s price contest.', 'Open 100 and close 106 form a ₹6 bullish body; low 97 adds a ₹3 lower wick.', 'Interpret body and wicks only with trend, level and volume.', 'Naming a candle pattern without checking where it formed'),
      topic('Volume', 'Volume counts traded units during a period. It can confirm participation but must be compared with the instrument’s own history and market structure.', 'A breakout on 2 crore shares versus a 20-day average of 80 lakh shows higher participation.', 'Compare relative volume and price response.', 'Equating high volume with automatic buying'),
      topic('Trend Identification', 'An uptrend usually forms higher highs and higher lows; a downtrend forms lower highs and lower lows. Trends exist on specific timeframes.', 'Mark highs 100, 110, 118 and lows 92, 101, 109 as rising structure.', 'Define swing rules before labelling a trend.', 'Calling one large green candle an uptrend'),
      topic('Gaps', 'A gap occurs when a market opens outside the prior trading range. News, liquidity and overnight repricing can create gaps.', 'Yesterday’s high is ₹100 and today’s low is ₹104, leaving a ₹4 gap.', 'Wait for price behaviour and volume before acting on a gap.', 'Assuming every gap must soon be filled'),
      topic('Log vs Linear Scale', 'Linear charts show equal price changes equally; logarithmic charts show equal percentage changes equally. Log scale is often clearer across large long-term moves.', '₹10 to ₹20 and ₹100 to ₹110 both add ₹10, but returns are 100% and 10%.', 'Use log scale for long percentage-based comparisons.', 'Drawing long-term trendlines on an unsuitable scale'),
      topic('Chart Context', 'Chart context combines trend, level, volatility, volume and broader market conditions. A pattern’s meaning changes with its location.', 'A hammer at long-term support after a 20% fall differs from one mid-range after a 2% move.', 'Ask where, after what move and with what confirmation.', 'Trading a pattern name in isolation'),
      topic('Technical Analysis Limits', 'Technical analysis organises price and volume evidence; it cannot guarantee outcomes or replace risk control and fundamental context where relevant.', 'Even a setup winning 60 of 100 times loses 40 times before costs.', 'Use probabilistic setups with invalidation and position limits.', 'Backfitting indicators until history looks perfect'),
    ],
  },
  {
    name: 'Candlestick Mastery',
    difficulty: A,
    outcome: 'Recognise candle patterns and reject them when context is missing.',
    visual: 'candlestick replay board',
    marketAnchor: 'liquid NSE stock and Nifty 50 candle replays',
    lessons: [
      topic('Hammer', 'A hammer has a small body near the high and a long lower wick. After a decline it can show rejection of lower prices, not guaranteed reversal.', 'Open 101, high 103, low 92, close 102 creates a long lower wick after a downtrend.', 'Require a prior decline, meaningful level and confirmation.', 'Calling the same shape bullish anywhere on a chart'),
      topic('Doji', 'A doji forms when open and close are nearly equal. It shows balance or indecision, with meaning determined by trend, wick and location.', 'Open ₹100 and close ₹100.10 after a ₹8 intraday range forms a near-doji.', 'Wait for the next move and use surrounding context.', 'Treating every doji as an immediate reversal'),
      topic('Marubozu', 'A marubozu has a large body with little or no wick, showing strong one-sided control during that period. Late appearances can still exhaust.', 'Open ₹100, low ₹100, high ₹110 and close ₹110 forms a bullish marubozu.', 'Compare body size, volume and position in the trend.', 'Buying a large green candle after an already extended move'),
      topic('Shooting Star', 'A shooting star has a small body near the low and a long upper wick after an advance. It can signal rejection of higher prices.', 'Open ₹108, high ₹118, low ₹107, close ₹108.50 after an uptrend.', 'Require an advance, resistance or confirmation before a bearish view.', 'Shorting the shape when it appears after a decline'),
      topic('Bullish Engulfing', 'A bullish engulfing pattern has a down candle followed by an up body that covers the prior body. After a decline it can show a momentum shift.', 'A ₹104–₹100 red body is followed by a ₹99–₹106 green body.', 'Check decline, support, volume and next-candle confirmation.', 'Requiring wicks to be engulfed even though the core definition uses bodies'),
      topic('Bearish Engulfing', 'A bearish engulfing pattern has an up candle followed by a down body covering the prior body. After an advance it can show sellers taking control.', 'A ₹100–₹104 green body is followed by a ₹105–₹98 red body.', 'Check prior rise, resistance, volume and invalidation.', 'Calling two red candles a bearish engulfing pattern'),
      topic('Harami', 'A harami has a large body followed by a smaller body contained within it. It signals contraction and possible change, but needs confirmation.', 'A ₹100–₹110 body is followed by a ₹108–₹104 body inside the first.', 'Treat it as a pause until direction confirms.', 'Assuming an inside body predicts the direction by itself'),
      topic('Piercing Pattern', 'A piercing pattern follows a decline: a down candle is followed by an up candle closing above the midpoint of the first body.', 'First body falls ₹110 to ₹100; next opens ₹98 and closes above midpoint ₹105.', 'Verify the midpoint close, prior decline and support.', 'Confusing any green candle after a red one with piercing'),
      topic('Morning and Evening Star', 'Star patterns use three candles: momentum, indecision and an opposing confirmation candle. Morning stars are bullish after declines; evening stars are bearish after advances.', 'A large red candle, small body, then green close above the first body’s midpoint forms a morning-star structure.', 'Score all three candles plus location and volume.', 'Ignoring the prior trend because the three shapes look right'),
      topic('Three Soldiers and Three Crows', 'Three white soldiers are three strong rising candles; three black crows are three strong falling candles. They show persistent control but can become extended.', 'Three closes rise ₹100, ₹106, ₹112, ₹118 with limited wicks.', 'Check orderly opens, body quality, location and extension risk.', 'Entering after the third candle without considering poor reward-to-risk'),
    ],
  },
  {
    name: 'Chart Analysis',
    difficulty: A,
    outcome: 'Mark repeatable structures and make conditional chart decisions.',
    visual: 'annotatable price chart',
    marketAnchor: 'Nifty 50 and high-liquidity NSE charts',
    lessons: [
      topic('Support', 'Support is a price zone where demand previously absorbed supply. It is an area, not an exact floor, and can fail.', 'Price responds near ₹980, ₹990 and ₹985; mark a ₹980–₹990 zone rather than one line.', 'Use multiple reactions, context and invalidation to score support.', 'Buying merely because price touched an old line'),
      topic('Resistance', 'Resistance is a zone where supply previously overcame demand. A break can turn the zone into support, but only after evidence.', 'Highs at ₹1,200, ₹1,195 and ₹1,205 define a ₹1,195–₹1,205 zone.', 'Mark zones from repeated reactions and test breakout quality.', 'Shorting every first touch regardless of trend strength'),
      topic('Trendlines', 'A trendline connects selected swing points to visualise direction and potential reaction. Small point changes can alter it, so rules must be consistent.', 'Connect higher lows at ₹90, ₹96 and ₹103 without cutting through major bodies.', 'Use confirmed swings and allow a zone around the line.', 'Forcing a line through prices to support a forecast'),
      topic('Channels', 'A channel uses roughly parallel boundaries around a trend. It helps frame location and volatility but does not force price to remain inside.', 'Lower boundary rises ₹100 to ₹110 while a parallel upper boundary rises ₹120 to ₹130.', 'Trade only with confirmation and define behaviour on a break.', 'Assuming channel edges guarantee reversal'),
      topic('Breakouts', 'A breakout moves beyond a recognised range, trendline or zone. Follow-through, closing price and volume help judge acceptance.', 'Resistance is ₹500–₹505; price closes ₹512 on 1.8× average volume.', 'Require a defined level, decisive acceptance and risk point.', 'Buying an intraday poke above resistance before close'),
      topic('False Breakouts', 'A false breakout moves beyond a level but quickly returns inside, trapping late entries. It is known only after rejection becomes visible.', 'Price trades to ₹510 above ₹500 resistance but closes at ₹494.', 'Wait for close, retest or acceptance evidence.', 'Calling every failed trade a false breakout after the fact'),
      topic('Pullbacks', 'A pullback is a temporary move against a prevailing trend. It can offer location but may also begin a reversal.', 'In an uptrend from ₹100 to ₹130, price retreats to prior breakout near ₹120.', 'Check trend structure, pullback depth and renewed demand.', 'Buying every decline because the prior trend was up'),
      topic('Range Trading', 'A range forms when price rotates between support and resistance without sustained direction. Reward-to-risk worsens near the middle.', 'Trade zone spans ₹900–₹1,000; ₹950 is the middle with less edge.', 'Plan near boundaries and stop when the range decisively breaks.', 'Buying the range midpoint from boredom'),
      topic('Multi-Timeframe Analysis', 'Multi-timeframe analysis uses a higher chart for trend and levels, then a lower chart for setup and execution. Timeframes must serve distinct roles.', 'Weekly trend is up, daily pulls to support and hourly confirms a higher low.', 'Move from context to setup to trigger without timeframe shopping.', 'Using five timeframes until one agrees with the desired trade'),
      topic('Chart Analysis Playbook', 'A chart playbook defines market, timeframe, setup, trigger, invalidation, size and review. It turns drawing into a repeatable decision process.', 'Record trend, ₹500 zone, ₹512 trigger, ₹492 invalidation and 1% account risk.', 'Take only setups meeting every required rule.', 'Adding rules after entry to justify staying in a losing trade'),
    ],
  },
  {
    name: 'Technical Indicators',
    difficulty: A,
    outcome: 'Use indicators as transformations of data, not independent predictions.',
    visual: 'indicator workbench',
    marketAnchor: 'dated Nifty 50 and liquid NSE price-volume data',
    lessons: [
      topic('Simple Moving Average', 'A simple moving average is the arithmetic mean of recent prices. It smooths noise but lags and gives equal weight to every observation.', 'Closes 100, 102, 104, 106, 108 have a 5-period SMA of 104.', 'Use one consistent period and interpret slope, distance and context.', 'Treating an SMA cross as a guaranteed forecast'),
      topic('Exponential Moving Average', 'An exponential moving average weights recent prices more heavily than older prices. It reacts faster than an equivalent SMA but can create more whipsaws.', 'A new 110 close influences a 10-period EMA more than a 50-period EMA.', 'Choose sensitivity that matches timeframe and test whipsaw cost.', 'Assuming faster response means greater accuracy'),
      topic('Moving Average Crossovers', 'A crossover occurs when a faster average crosses a slower one. It can identify trend change late and performs poorly in sideways markets.', 'A 20-day average crosses above a 50-day average after price has already risen.', 'Combine crossovers with market regime and risk rules.', 'Entering every crossover without measuring range-bound whipsaws'),
      topic('RSI', 'The Relative Strength Index is a 0–100 momentum oscillator based on recent gains and losses. High or low readings are conditions, not automatic reversal signals.', 'RSI at 75 shows strong recent gains; price can remain strong above 70.', 'Read RSI with trend, level and failure signals.', 'Shorting solely because RSI crossed 70'),
      topic('RSI Divergence', 'RSI divergence occurs when price and RSI make different swing directions. It warns of changing momentum but can persist or fail.', 'Price makes a higher high from ₹100 to ₹108 while RSI falls from 78 to 68.', 'Require clear swings and price confirmation.', 'Drawing divergence between arbitrary points'),
      topic('MACD', 'MACD subtracts a slower EMA from a faster EMA; a signal line smooths the result. It tracks momentum and trend but remains price-derived and lagging.', 'MACD rises from −2 to +1 and crosses its signal after price strengthens.', 'Use line, signal, histogram and zero-line context together.', 'Assuming histogram colour alone is a trade'),
      topic('Bollinger Bands', 'Bollinger Bands place volatility-based bands around a moving average. Bands widen with volatility and narrow with calm; touching a band is not automatically a reversal.', 'A 20-day mean is ₹100 and two standard deviations are ₹8, producing bands near ₹92 and ₹108.', 'Interpret band walks, squeezes and closes within trend context.', 'Selling every upper-band touch'),
      topic('VWAP', 'Volume-weighted average price is the average traded price weighted by volume, commonly reset each session. Institutions may use it as an execution benchmark.', '100 shares at ₹100 and 300 at ₹104 produce VWAP ₹103.', 'Know the reset period and combine VWAP with liquidity and structure.', 'Using daily VWAP as a long-term valuation measure'),
      topic('Average True Range', 'Average True Range measures recent range including gaps. It estimates volatility in price units but does not predict direction.', 'ATR ₹5 means typical true range is about ₹5, not that price will rise ₹5.', 'Scale stops and position size to volatility and setup.', 'Using the same rupee stop for assets with different ATR'),
      topic('Indicator Confluence', 'Confluence means independent evidence supports one idea. Multiple indicators derived from the same price may be redundant rather than independent.', 'RSI, MACD and two moving averages all use price; support plus volume adds different evidence.', 'Combine non-duplicative evidence and keep a simple hierarchy.', 'Adding indicators until one confirms the desired decision'),
    ],
  },
  {
    name: 'Behavioral Finance',
    difficulty: I,
    outcome: 'Recognise predictable decision errors and install countermeasures.',
    visual: 'decision journal and bias mirror',
    marketAnchor: 'Nifty 50 market cycles and common retail-investor decisions',
    lessons: [
      topic('Fear and Greed', 'Fear can cause panic exits; greed can cause excessive risk. Emotions are information about the investor, not evidence about an asset’s value.', 'A 15% market fall triggers selling after the loss, while a 30% rally triggers buying after the gain.', 'Use allocation and review rules written before emotional events.', 'Trying to remove emotion instead of controlling actions'),
      topic('FOMO', 'Fear of missing out creates urgency after observing others’ gains. It narrows attention to upside and hides valuation, risk and suitability.', 'A stock rises 40% in one month and the learner doubles the intended position without research.', 'Pause, write the thesis and cap size before acting.', 'Calling urgency evidence that an opportunity is valid'),
      topic('Loss Aversion', 'Loss aversion means losses often feel stronger than equal gains. It can cause premature profit-taking and refusal to exit weak holdings.', 'A ₹10,000 loss hurts more than a ₹10,000 gain pleases, changing otherwise identical choices.', 'Judge decisions from future evidence, not purchase price pain.', 'Holding only to get back to break-even'),
      topic('Confirmation Bias', 'Confirmation bias favours information that supports an existing belief and discounts contradictory evidence.', 'After buying, the learner saves 8 positive articles and ignores 2 material risk disclosures.', 'Seek disconfirming evidence and define what would change the view.', 'Following only analysts who share the thesis'),
      topic('Anchoring', 'Anchoring gives excessive weight to an initial number such as purchase price, prior high or target. New evidence may make that number irrelevant.', 'A share fell from ₹1,000 to ₹600; ₹1,000 does not prove ₹600 is cheap.', 'Re-estimate value from current evidence and scenarios.', 'Using the 52-week high as a fair-value guarantee'),
      topic('Overconfidence', 'Overconfidence makes people overestimate skill, precision or control. It often appears as concentrated positions, frequent trading and narrow forecasts.', 'Three winning trades lead the learner to raise risk from 1% to 10% per trade.', 'Track results against a benchmark and use fixed risk limits.', 'Attributing gains to skill and losses only to bad luck'),
      topic('Recency Bias', 'Recency bias gives recent events too much weight when estimating the future. Short samples can overwhelm longer evidence.', 'After 3 strong years, the learner assumes 20% annual returns will continue indefinitely.', 'Use multiple regimes, base rates and stress cases.', 'Planning retirement from the last year’s return'),
      topic('Herd Behaviour', 'Herd behaviour copies a group because social agreement feels informative or safe. Crowds can be right, but popularity is not independent evidence.', 'A trending stock receives 1 lakh posts, yet the learner cannot explain revenue or valuation.', 'Build a thesis from primary evidence before considering sentiment.', 'Treating many buyers as proof the price cannot fall'),
      topic('Disposition Effect', 'The disposition effect is selling winners too early while holding losers too long. Purchase price replaces forward-looking analysis.', 'Sell a strong thesis at +10% but keep a broken thesis at −30% to avoid realising loss.', 'Review winners and losers with the same thesis and valuation rules.', 'Calling every realised gain good and every realised loss bad'),
      topic('Decision Journal', 'A decision journal records evidence, assumptions, alternatives, confidence, risks and expected review date before outcomes are known.', 'Write a 60% probability, ₹500 value range and three invalidation signals before buying.', 'Score process separately from outcome during review.', 'Editing the original thesis after seeing the result'),
    ],
  },
  {
    name: 'Economics for Investors',
    difficulty: A,
    outcome: 'Translate macro data into scenarios without making one-variable forecasts.',
    visual: 'macro regime dashboard',
    marketAnchor: 'RBI policy, Indian inflation data, GDP and Nifty 50 sectors',
    lessons: [
      topic('GDP', 'Gross domestic product measures final goods and services produced within an economy over a period. Real GDP removes price effects; nominal GDP does not.', 'Nominal output rises 10% while prices rise 6%; real growth is much lower than 10%.', 'Separate level, growth, per-capita and real versus nominal data.', 'Assuming strong GDP growth guarantees stock returns'),
      topic('Inflation', 'Inflation is a sustained rise in the general price level, reducing money’s purchasing power. Different households experience different personal inflation.', 'At 6% inflation, a ₹100 basket costs about ₹106 after one year.', 'Compare after-inflation returns and match assets to goal horizon.', 'Treating one expensive item as proof of the whole inflation rate'),
      topic('CPI and WPI', 'CPI tracks prices faced by consumers; WPI tracks wholesale goods prices. Their baskets and economic meanings differ.', 'Food weight can move CPI while commodity input prices move WPI differently in the same month.', 'Use the index matching the question and inspect components.', 'Comparing CPI and WPI as if their baskets were identical'),
      topic('Repo Rate', 'The repo rate is the policy rate at which RBI lends short-term funds against securities to eligible banks. It influences, but does not mechanically set, all rates.', 'A 0.50-point repo change may pass through differently to loans, deposits and bonds.', 'Trace the transmission path and time lag.', 'Assuming every EMI changes by the full repo move immediately'),
      topic('Monetary Policy', 'Monetary policy uses rates, liquidity and communication to pursue price stability while considering growth. Effects arrive with uncertain lags.', 'Higher rates can cool credit demand over 6–18 months rather than overnight.', 'Build scenarios for inflation, growth, currency and rates.', 'Predicting markets from one policy headline'),
      topic('Fiscal Policy', 'Fiscal policy changes government spending, taxation and borrowing. It can support demand or investment while affecting deficits, debt and sector outcomes.', '₹1 lakh crore of infrastructure spending differs from the same amount of temporary transfers in economic path.', 'Separate size, funding, timing and composition.', 'Calling every increase in government spending equally bullish'),
      topic('Government Deficit', 'A fiscal deficit occurs when government expenditure exceeds non-borrowed receipts. Its sustainability depends on growth, interest cost and spending quality.', 'Spending ₹110 with receipts ₹100 creates a deficit of ₹10 funded by borrowing or other means.', 'Compare deficit to GDP and examine where borrowed money goes.', 'Assuming any deficit is either harmless or automatically disastrous'),
      topic('Unemployment', 'Unemployment measures people without work who are available and seeking it. Participation and job quality matter alongside the headline rate.', 'Unemployment can fall if 2 of 100 jobseekers stop looking, even without new jobs.', 'Read unemployment with participation, wages and employment growth.', 'Using one rate as a complete picture of labour health'),
      topic('Business Cycle', 'The business cycle moves through expansion, slowdown, contraction and recovery. Sectors and assets react differently, and turning points are hard to time.', 'Growth and inflation produce four regimes; map equities, duration and cash responses in each.', 'Use diversified scenarios rather than one precise cycle call.', 'Switching the entire portfolio after a lagging indicator confirms a phase'),
      topic('Economy-to-Portfolio Map', 'An economy-to-portfolio map links growth, inflation, rates and policy to revenue, margins, valuation and asset behaviour through explicit scenarios.', 'Model high growth/high inflation versus low growth/low inflation across banks, IT, bonds and gold.', 'Write transmission channels, probabilities and portfolio limits.', 'Jumping from “rates fell” directly to “all stocks rise”'),
    ],
  },
  {
    name: 'Advanced Investing',
    difficulty: A,
    outcome: 'Build and defend an evidence-based investment thesis and valuation range.',
    visual: 'investment committee memo',
    marketAnchor: 'Reliance Industries, HDFC Bank, Infosys, TCS and Nifty 50 peers',
    lessons: [
      topic('Value Investing', 'Value investing seeks assets priced below conservatively estimated worth. A low multiple alone is insufficient because quality, decline and uncertainty matter.', 'Estimate value at ₹600–₹750 versus price ₹500, then test whether falling earnings erase the gap.', 'Demand a reasoned value range and a catalyst or patience case.', 'Buying statistically cheap businesses with permanently weakening economics'),
      topic('Growth Investing', 'Growth investing pays for businesses expected to expand revenue, profit or cash flow faster than peers. High expectations make valuation and execution crucial.', 'A company growing 25% at PE 60 must sustain more than one strong quarter.', 'Model growth duration, reinvestment, margins and valuation compression.', 'Calling any fast-rising share a growth company'),
      topic('Dividend Investing', 'Dividend investing focuses on cash distributions and their sustainability. Yield depends on price, while payout quality depends on cash flow, balance sheet and reinvestment needs.', '₹20 annual dividend on price ₹400 gives 5% yield before tax, but a cut halves it.', 'Prefer sustainable cash generation and sensible payout policy.', 'Buying the highest yield without checking why price fell'),
      topic('Quality Investing', 'Quality investing favours durable advantages, sound governance, strong balance sheets and high returns on capital. Even excellent businesses can be poor buys at extreme prices.', 'Compare 20% ROCE with low debt for 10 years against 35% ROCE for one cyclical peak year.', 'Test durability, reinvestment runway and price paid.', 'Using a quality label to ignore valuation'),
      topic('Factor Investing', 'Factor investing targets systematic traits such as value, momentum, quality, size or low volatility through transparent rules. Factors can underperform for long periods.', 'Split a 100-stock universe into the cheapest 20 after liquidity and quality screens.', 'Understand definition, turnover, cost and regime risk.', 'Choosing a factor only because it led last year'),
      topic('Moat Analysis', 'A moat is a durable advantage protecting returns from competition. Sources include switching costs, networks, cost advantage, brand and efficient scale.', 'A firm keeps 20% ROCE while competitors enter; identify the mechanism rather than the outcome alone.', 'Look for customer evidence, economics and signs of erosion.', 'Calling high market share a moat without explaining its defence'),
      topic('Margin of Safety', 'Margin of safety is the discount between price and conservative estimated value. It protects against error but cannot rescue a fundamentally wrong thesis.', 'Value range ₹800–₹1,000 and price ₹600 offers more cushion than price ₹790.', 'Base the discount on uncertainty, quality and downside.', 'Using one optimistic valuation to manufacture a large margin'),
      topic('Scenario Valuation', 'Scenario valuation estimates value under bear, base and bull assumptions, then weights outcomes or uses the range to size risk.', 'Values ₹400, ₹700 and ₹1,000 with probabilities 25%, 50%, 25% give expected value ₹700.', 'Make revenue, margin, capital and multiple assumptions internally consistent.', 'Changing only the valuation multiple across scenarios'),
      topic('Capital Allocation', 'Capital allocation is management’s choice among reinvestment, acquisition, debt repayment, dividends and buybacks. Value depends on returns and price.', 'A buyback at ₹500 creates value if conservative worth is ₹800, but destroys value if worth is ₹350.', 'Track incremental returns and management’s record per rupee retained.', 'Praising every dividend or acquisition regardless of opportunity cost'),
      topic('Investment Thesis and Exit Rules', 'An investment thesis states why market expectations may be wrong, what evidence matters, valuation and risks. Exit rules define invalidation, valuation and portfolio reasons to sell.', 'Record price ₹500, value ₹650–₹800, three milestones and two invalidation signals.', 'Write the thesis and exits before position emotion develops.', 'Selling only because price fell or holding only because it has not reached the target'),
    ],
  },
];

const interactionTypes = [
  'drag_and_drop',
  'scenario_decision',
  'calculator',
  'portfolio_builder',
  'risk_identification',
  'chart_marking',
  'pattern_recognition',
  'match_the_concept',
];

function slug(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function difficultyFor(moduleDifficulty, lessonIndex) {
  if (moduleDifficulty === D) return lessonIndex < 6 ? D : I;
  if (moduleDifficulty === I) return lessonIndex < 7 ? I : A;
  return A;
}

function rotateOptions(correct, incorrect, offset) {
  const options = [correct].concat(incorrect.slice(0, 3));
  const shift = offset % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  return { options: rotated, correctOptionIndex: rotated.indexOf(correct), correctAnswer: correct };
}

function question(type, prompt, correct, incorrect, explanation, offset) {
  return Object.assign(
    { type, question: prompt, explanation },
    rotateOptions(correct, incorrect, offset),
  );
}

function buildQuiz(t, module, lessonIndex) {
  const genericWrong = [
    'Choose the option with the highest recent return',
    'Copy the most popular decision without checking suitability',
    'Ignore costs, uncertainty and the learner’s goal',
  ];
  return [
    question(
      'mcq',
      'Which statement best explains ' + t.title + '?',
      t.definition,
      [
        'It is a guarantee that removes financial uncertainty.',
        t.commonTrap + '.',
        'It is a prediction based only on yesterday’s market move.',
      ],
      'The correct choice defines the concept without promising an outcome.',
      lessonIndex,
    ),
    question(
      'mcq',
      'Which action best applies ' + t.title + '?',
      t.decisionRule,
      [t.commonTrap, genericWrong[0], genericWrong[1]],
      t.decisionRule + ' This turns the concept into a repeatable decision.',
      lessonIndex + 1,
    ),
    question(
      'mcq',
      'What is the key lesson from this worked example: ' + t.workedExample,
      t.decisionRule,
      [t.commonTrap, genericWrong[0], genericWrong[2]],
      'The numbers matter because they make the decision rule visible: ' + t.decisionRule,
      lessonIndex + 2,
    ),
    question(
      'scenario',
      'A learner faces this case: ' + t.workedExample + ' What should the learner do next?',
      t.decisionRule,
      [t.commonTrap, genericWrong[0], genericWrong[1]],
      'The best next step applies ' + t.title + ' while preserving the learner’s constraints.',
      lessonIndex + 3,
    ),
    question(
      'scenario',
      'The learner is tempted by this shortcut: ' + t.commonTrap + '. Which response shows mastery?',
      t.decisionRule,
      [
        'Proceed because shortcuts save time.',
        'Increase the amount at risk to make the outcome matter.',
        'Wait for social media to confirm the choice.',
      ],
      'Mastery means replacing the common trap with a pre-defined, evidence-based rule.',
      lessonIndex,
    ),
    question(
      'real_life',
      'While reviewing ' + module.marketAnchor + ', how should the learner use ' + t.title + '?',
      'Use dated public evidence, state assumptions, and then: ' + t.decisionRule,
      [
        'Use an undated screenshot and infer a guaranteed return.',
        'Treat the company or index name as a recommendation.',
        'Use one data point and ignore contradictory evidence.',
      ],
      'A real-market answer must be dated, sourceable and explicit about what the evidence cannot prove.',
      lessonIndex + 1,
    ),
  ];
}

function buildLesson(module, moduleIndex, t, lessonIndex) {
  const difficulty = difficultyFor(module.difficulty, lessonIndex);
  const xpReward = difficulty === D ? 40 : difficulty === I ? 60 : 80;
  const id = 'm' + String(moduleIndex + 1).padStart(2, '0') + '-l' + String(lessonIndex + 1).padStart(2, '0');
  const prerequisite = lessonIndex > 0
    ? 'm' + String(moduleIndex + 1).padStart(2, '0') + '-l' + String(lessonIndex).padStart(2, '0')
    : moduleIndex > 0
      ? 'm' + String(moduleIndex).padStart(2, '0') + '-l10'
      : null;

  return {
    id,
    moduleName: module.name,
    lessonName: t.title,
    difficulty,
    estimatedDurationMinutes: 2 + ((moduleIndex + lessonIndex) % 4),
    xpReward,
    prerequisites: prerequisite ? [prerequisite] : [],
    learningObjective: 'Use ' + t.title + ' to make or evaluate one financial decision.',
    definition: t.definition,
    visualUnderstanding: {
      format: module.visual,
      workedExample: t.workedExample,
      comparison: 'Show the disciplined rule beside the common trap and quantify the difference in rupees, percentage, time or risk.',
      learnerInteraction: 'Let the learner change one numeric input, predict the result, and then reveal the consequence.',
      takeaway: t.decisionRule,
    },
    practiceExercise: {
      type: interactionTypes[(moduleIndex * 2 + lessonIndex) % interactionTypes.length],
      prompt: 'Apply ' + t.title + ' to this case: ' + t.workedExample,
      learnerActions: [
        'Identify the relevant number or constraint.',
        'Choose an action and commit before seeing feedback.',
        'Revise the action after one assumption changes.',
      ],
      correctPrinciple: t.decisionRule,
      misconceptionToDetect: t.commonTrap,
      feedback: {
        correct: 'Correct. ' + t.decisionRule,
        retry: 'Recheck the numbers and avoid this trap: ' + t.commonTrap + '.',
        hint: 'Name the goal, horizon or risk constraint before choosing.',
      },
    },
    quiz: buildQuiz(t, module, lessonIndex),
    realMarketExample: {
      instrumentOrSource: module.marketAnchor,
      scenario: 'Use a dated public snapshot for ' + module.marketAnchor + '. Recreate this learning case with real disclosed data: ' + t.workedExample,
      learnerTask: 'Locate the evidence, apply ' + t.title + ', compare two choices and state one limitation.',
      correctPrinciple: t.decisionRule,
      dataPolicy: 'Production must display source and as-of date. No company or instrument is presented as a recommendation.',
    },
    masteryChallenge: {
      title: t.title + ': decision under pressure',
      task: 'Solve a three-stage case using ' + module.marketAnchor + ': make an initial choice, respond to new evidence, and defend the final choice in two sentences.',
      requiredEvidence: [t.workedExample, t.decisionRule, 'One downside or invalidation condition'],
      scoring: {
        conceptApplication: 35,
        numericalReasoning: 25,
        riskAwareness: 25,
        explanation: 15,
      },
      passScore: 75,
      xpReward: xpReward * 2,
    },
    aiTutorPrompts: [
      'Explain ' + t.title + ' like I am 12.',
      'Give me a new Indian example of ' + t.title + ' with different numbers.',
      'Quiz me on ' + t.title + ' without revealing the answer.',
      'Why is this a trap: ' + t.commonTrap + '?',
      'Challenge my reasoning about ' + t.title + '.',
    ],
  };
}

const lessonModules = modules.map((module, moduleIndex) => {
  const lessons = module.lessons.map((t, lessonIndex) => buildLesson(module, moduleIndex, t, lessonIndex));
  return {
    id: 'module-' + String(moduleIndex + 1).padStart(2, '0'),
    order: moduleIndex + 1,
    name: module.name,
    baseDifficulty: module.difficulty,
    outcome: module.outcome,
    submodules: [
      { name: 'Understand', lessonIds: lessons.slice(0, 4).map((lesson) => lesson.id) },
      { name: 'Apply', lessonIds: lessons.slice(4, 7).map((lesson) => lesson.id) },
      { name: 'Master', lessonIds: lessons.slice(7, 10).map((lesson) => lesson.id) },
    ],
    lessons,
    moduleGate: {
      requiredLessonMastery: 80,
      requiredQuizAccuracy: 75,
      requiredMasteryChallenge: true,
      maxUnresolvedMisconceptions: 1,
      retryMode: 'targeted remediation with changed numbers',
    },
  };
});

const labDefinitions = [
  ['Portfolio Builder Lab', 'Build portfolios that fit goals, horizons and constraints.', 'Beginner–Advanced', ['One goal and three assets', 'Multiple goals and liquidity', 'Tax and cost constraints', 'Committee defence under a market shock'], ['allocation fit', 'goal funding', 'cost control']],
  ['Diversification Lab', 'See how holdings, sectors and correlations change risk.', 'Beginner–Advanced', ['Ticker-count illusion', 'Sector concentration', 'Correlation regime shift', 'Diversification audit and repair'], ['risk-driver coverage', 'concentration', 'stress resilience']],
  ['Risk Lab', 'Control loss before seeking return.', 'Intermediate–Advanced', ['Spot hidden risks', 'Calculate position size', 'Respond to drawdown', 'Write and defend a risk policy'], ['loss budget', 'rule compliance', 'adaptation']],
  ['Stock Analysis Lab', 'Turn company disclosures into a reasoned valuation range.', 'Intermediate–Advanced', ['Statement scavenger hunt', 'Ratio diagnosis', 'Peer and history comparison', 'Investment committee memo'], ['evidence quality', 'financial reasoning', 'valuation discipline']],
  ['Candlestick Recognition Lab', 'Recognise patterns only when trend and location support them.', 'Intermediate–Advanced', ['Single-candle shapes', 'Double-candle sequences', 'Triple-candle sequences', 'No-pattern and context traps'], ['shape accuracy', 'context', 'false-positive control']],
  ['Chart Drawing Lab', 'Mark swing structure consistently on unseen charts.', 'Intermediate–Advanced', ['Swing points', 'Trendlines', 'Channels and ranges', 'Multi-timeframe map'], ['anchor consistency', 'zone quality', 'invalidation']],
  ['Support & Resistance Lab', 'Identify zones and test their decision value.', 'Intermediate–Advanced', ['Basic zones', 'Touch-quality scoring', 'Breakout and retest', 'False-break defence'], ['zone accuracy', 'confirmation', 'risk placement']],
  ['Market Replay Lab', 'Make timestamped decisions without hindsight.', 'Advanced', ['Quiet regime', 'Volatility expansion', 'Crash response', 'Recovery and post-trade review'], ['process quality', 'risk discipline', 'hindsight resistance']],
  ['Investor Flight Simulator', 'Operate a complete portfolio through changing regimes.', 'Advanced', ['Pre-flight plan', 'Rate and inflation shock', 'Earnings turbulence', 'Landing review and defence'], ['goal survival', 'risk budget', 'decision journal']],
  ['Retirement Planning Simulator', 'Build and stress-test an inflation-aware retirement plan.', 'Intermediate–Advanced', ['Corpus estimate', 'Inflation and longevity shock', 'Sequence-risk response', 'Adaptive withdrawal defence'], ['funding ratio', 'withdrawal resilience', 'assumption quality']],
];

const labs = labDefinitions.map((lab, labIndex) => ({
  id: 'lab-' + String(labIndex + 1).padStart(2, '0'),
  name: lab[0],
  purpose: lab[1],
  difficulty: lab[2],
  prerequisites: labIndex < 2 ? ['Modules 1–4'] : labIndex < 4 ? ['Modules 1–9'] : labIndex < 8 ? ['Modules 10–13'] : ['Modules 1–16'],
  levels: lab[3].map((name, levelIndex) => ({
    level: levelIndex + 1,
    name,
    practiceExercises: [
      'Complete one guided case with visible feedback.',
      'Repeat with changed numbers and no answer cue.',
      levelIndex === 3 ? 'Defend the final decision to the AI examiner.' : 'Explain the strongest rejected alternative.',
    ],
    attemptsToMaster: 2,
    xpReward: 100 + levelIndex * 50,
  })),
  scoringLogic: {
    dimensions: {
      primarySkill: { weight: 35, evidence: lab[4][0] },
      process: { weight: 25, evidence: lab[4][1] },
      riskControl: { weight: 25, evidence: lab[4][2] },
      explanation: { weight: 15, evidence: 'clear assumptions and trade-offs' },
    },
    passScore: 70,
    masteryScore: 85,
    criticalFail: 'Any hidden-answer use or breach of a stated maximum-loss rule.',
  },
  xpRewards: {
    firstPass: 300,
    masteryBonus: 150,
    noHintBonus: 50,
    improvedReplay: 60,
    routineReplay: 20,
  },
}));

const licenses = [
  ['Bronze', 32, 4, 55, 70, 2, 'Foundations Navigator'],
  ['Silver', 64, 7, 65, 75, 3, 'Market Explorer'],
  ['Gold', 96, 10, 75, 80, 4, 'Portfolio Builder'],
  ['Platinum', 128, 13, 82, 85, 6, 'Investment Analyst'],
  ['Diamond', 160, 16, 90, 90, 10, 'Vestiqo Investor'],
].map((license, index) => ({
  name: license[0],
  requirements: [
    'Master ' + license[1] + ' required lessons through Module ' + license[2] + '.',
    'Complete ' + license[5] + ' assigned labs at 70 or above.',
    'Clear all critical risk remediations.',
    'Complete required spaced reviews with at least 70% retrieval accuracy.',
  ],
  lessonsRequired: license[1],
  modulesRequiredThrough: license[2],
  minimumReadinessScore: license[3],
  exams: {
    knowledgeQuestions: 25 + index * 5,
    scenarioQuestions: 5 + index * 2,
    timeMinutes: 30 + index * 10,
    passPercent: license[4],
    domainFloorPercent: 60 + index * 5,
    retakeCooldownHours: 24,
    itemPolicy: 'Changed numbers and scenarios on every attempt; no identical retry set.',
  },
  practicalChallenges: [
    labs[Math.min(index * 2, 9)].name,
    labs[Math.min(index * 2 + 1, 9)].name,
    'Defend one decision and one rejected alternative to the AI examiner.',
  ],
  unlockRewards: [
    license[6] + ' passport badge',
    String(500 + index * 500) + ' bonus XP',
    index < 4 ? 'Next license path and its labs' : 'Diamond seasonal simulations and mentor eligibility',
  ],
  validity: 'No expiry; readiness badge shows current score and becomes “refresh due” after 180 days without assessed evidence.',
}));

const systems = {
  completeLearningPath: {
    loop: ['Definition', 'Visual Understanding', 'Practice', 'Quiz', 'Real Market Example', 'Mastery Challenge', 'XP Reward', 'Spaced Review'],
    phases: [
      { name: 'Money Operator', modules: [1, 2, 3, 4], capstone: 'Personal money plan and risk profile' },
      { name: 'Investor Core', modules: [5, 6, 7, 8, 9], capstone: 'Goal-based portfolio and risk policy' },
      { name: 'Market Reader', modules: [10, 11, 12, 13], capstone: 'Chart playbook with no-pattern controls' },
      { name: 'Independent Investor', modules: [14, 15, 16], capstone: 'Dated investment memo and flight simulation' },
    ],
    dailyLoop: ['One due review', 'One new 2–5 minute lesson', 'One practice drill', 'Optional simulator mission'],
    unlockRule: 'Pass each lesson quiz at 75%, score 75 on mastery challenge, and satisfy the module gate.',
    remediation: 'Missed concepts create a changed-number micro-lesson due within 24 hours; reading time never counts as mastery.',
  },
  practiceSystems: {
    attemptModel: 'predict → commit → consequence → explain → retry with changed data',
    hintLevels: ['Name the relevant constraint', 'Point to the relevant evidence', 'Show the first calculation step'],
    adaptiveDifficulty: [
      'Two consecutive scores of 85+ increase ambiguity or add a constraint.',
      'A score below 60 removes one distractor and assigns a prerequisite drill.',
      'A critical risk breach forces remediation before the next simulator level.',
    ],
    labIds: labs.map((lab) => lab.id),
  },
  quizSystem: {
    perLessonMix: { mcq: 3, scenario: 2, realLife: 1, total: 6 },
    scoring: { correct: 1, incorrect: 0, firstPassPercent: 75, masteryPercent: 90 },
    partialCredit: 'None for MCQs; mastery explanations and lab reasoning use rubrics.',
    itemRules: [
      'One best answer, three plausible distractors and an explanation for every item.',
      'Scenario retries preserve the concept but change names, numbers and option order.',
      'No current market price appears without a source and as-of date.',
      'At least one question tests the common misconception, not simple recall.',
    ],
    reviewScheduleDays: [1, 3, 7, 14, 30, 90],
    reviewPriority: 'overdue × weakness × importance × recency decay',
  },
  xpSystem: {
    lessonCompletion: { Beginner: 40, Intermediate: 60, Advanced: 80 },
    quiz: { firstPass: 50, perfectBonus: 30, reviewPass: 20 },
    masteryChallenge: { Beginner: 80, Intermediate: 120, Advanced: 160 },
    labs: { firstPass: 300, masteryBonus: 150, noHintBonus: 50 },
    streak: { dailyBase: 10, dailyStep: 5, dailyCap: 50, freezeRule: 'One earned freeze per 7 active days; maximum two stored.' },
    antiGrinding: [
      'Only the first three same-day repeats of one activity earn replay XP.',
      'Incorrect rapid guessing under the minimum read time earns no XP and triggers a new item.',
      'XP unlocks cosmetics and access; readiness depends only on assessed evidence.',
    ],
  },
  readinessScore: {
    range: '0–100',
    formula: '0.25K + 0.30A + 0.25R + 0.10C + 0.10E',
    components: {
      K: 'Knowledge: difficulty-weighted adaptive quiz accuracy over the last 90 days.',
      A: 'Applied skill: rubric scores from labs, mastery challenges and simulators.',
      R: 'Risk discipline: position limits, diversification, downside planning and rule compliance.',
      C: 'Consistency: due-review completion and active learning weeks; streak length alone is insufficient.',
      E: 'Evidence freshness: exponential time decay with a 60-day half-life.',
    },
    evidenceRules: [
      'Require at least 50 scored actions across 8 modules before displaying a score above 69.',
      'Require two passed labs before displaying a score above 74.',
      'Shrink each component toward 50 until it has 10 independent scored observations.',
      'A critical risk breach caps R at 40 until two remediation cases pass.',
      'Reading time, video time, XP and subscription status never raise readiness.',
    ],
    bands: {
      '0–39': 'Foundation needed',
      '40–54': 'Developing',
      '55–69': 'Bronze-ready',
      '70–81': 'Independent with guardrails',
      '82–89': 'Advanced',
      '90–100': 'Diamond-ready',
    },
    updateCadence: 'Recalculate after each scored action; show component confidence and last-evidence date.',
  },
  portfolioHealth: {
    range: '0–100 educational diagnostic',
    formula: '100 − concentration − allocation mismatch − goal mismatch − liquidity − cost/complexity − behaviour',
    penalties: {
      concentration: {
        maximum: 25,
        rules: ['0.5 point for each percentage point a holding exceeds 20%, capped at 12.5.', '0.5 point for each percentage point a sector exceeds 35%, capped at 12.5.'],
      },
      allocationMismatch: {
        maximum: 20,
        rule: '0.4 × half the sum of absolute differences between actual and target asset-class weights.',
      },
      goalMismatch: {
        maximum: 20,
        rules: ['Up to 10 for volatile assets funding a goal due within 3 years.', 'Up to 10 when expected funding is below 80% of the goal target.'],
      },
      liquidity: {
        maximum: 15,
        rules: ['15 with under one month of essential liquidity; 10 under three months; 5 under six months; otherwise 0.'],
      },
      costAndComplexity: {
        maximum: 10,
        rules: ['Up to 5 for weighted annual costs above the category plan.', 'Up to 5 for duplicate holdings or products the learner cannot explain.'],
      },
      behaviour: {
        maximum: 10,
        rules: ['Up to 5 for unplanned turnover.', 'Up to 5 for unresolved risk-rule breaches.'],
      },
    },
    bands: { '85–100': 'Healthy', '70–84': 'Watch', '50–69': 'Needs work', '0–49': 'High risk' },
    guardrails: [
      'Show every input, assumption and penalty so the score is auditable.',
      'Do not score a portfolio until goal horizon, target allocation and essential liquidity are known.',
      'Offer educational repair actions, never personalised buy or sell instructions.',
      'Do not reward recent performance in the health score.',
    ],
  },
  recommendedLearningSequence: [
    'Onboarding diagnostic → Modules 1–4 → Bronze exam',
    'Modules 5–7 → Stock Analysis Lab → Silver checkpoint',
    'Modules 8–9 → Portfolio, Diversification and Risk Labs → Gold exam',
    'Modules 10–13 → Candlestick, Chart, Support/Resistance and Replay Labs → Platinum exam',
    'Modules 14–16 → Retirement Simulator and Investor Flight Simulator → Diamond defence',
    'Ongoing: due reviews, monthly portfolio-health audit and 180-day license refresh evidence',
  ],
};

const curriculum = {
  schemaVersion: '2.0.0',
  product: 'Vestiqo',
  locale: 'en-IN',
  currency: 'INR',
  generatedAt: '2026-06-23',
  contentPrinciples: [
    'Skill acquisition over passive consumption.',
    'Every lesson takes 2–5 minutes and requires a decision.',
    'Every answer explains the consequence, not merely correctness.',
    'Market examples use public dated evidence and are never recommendations.',
    'Mastery comes from retrieval, transfer and risk discipline—not completion time.',
  ],
  disclaimer: 'Educational content only. Examples are not investment advice. Market facts must be refreshed and date-labelled before release.',
  totals: {
    modules: lessonModules.length,
    lessons: lessonModules.reduce((total, module) => total + module.lessons.length, 0),
    lessonQuizQuestions: lessonModules.reduce((total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.quiz.length, 0), 0),
    labs: labs.length,
    licenses: licenses.length,
  },
  moduleTree: lessonModules.map((module) => ({
    id: module.id,
    order: module.order,
    name: module.name,
    baseDifficulty: module.baseDifficulty,
    outcome: module.outcome,
    submodules: module.submodules,
    moduleGate: module.moduleGate,
  })),
  modules: lessonModules,
  labs,
  licenses,
  systems,
};

function buildReadme(data) {
  const lines = [
    '# Vestiqo Complete Curriculum',
    '',
    'Version ' + data.schemaVersion + ' · India-first · ' + data.totals.lessons + ' lessons · ' + data.totals.lessonQuizQuestions + ' questions · ' + data.totals.labs + ' labs',
    '',
    '> ' + data.disclaimer,
    '',
    '## Learning design',
    '',
    'Every lesson follows **Definition → Visual Understanding → Practice → 6-question Quiz → Real Market Example → Mastery Challenge → XP → Spaced Review**.',
    '',
    'Each lesson contains a topic-specific definition under 50 words, a numeric visual, an interactive decision, exactly 3 MCQs + 2 scenarios + 1 real-life question with answers and explanations, a dated-data market task, a scored mastery challenge and AI tutor prompts.',
    '',
    '## Complete module and lesson tree',
    '',
  ];

  data.modules.forEach((module) => {
    lines.push('### ' + module.order + '. ' + module.name, '', module.outcome, '');
    module.submodules.forEach((submodule) => {
      const names = submodule.lessonIds.map((id) => module.lessons.find((lesson) => lesson.id === id).lessonName);
      lines.push('- **' + submodule.name + ':** ' + names.join(' · '));
    });
    lines.push('');
  });

  lines.push('## Complete learning path', '');
  data.systems.completeLearningPath.phases.forEach((phase, index) => {
    lines.push((index + 1) + '. **' + phase.name + '** — Modules ' + phase.modules.join(', ') + '. Capstone: ' + phase.capstone + '.');
  });
  lines.push('', 'Daily loop: ' + data.systems.completeLearningPath.dailyLoop.join(' → ') + '.', '');

  lines.push('## Practice systems', '');
  data.labs.forEach((lab) => {
    lines.push('- **' + lab.name + ':** ' + lab.purpose + ' Levels: ' + lab.levels.map((level) => level.name).join(' → ') + '.');
  });

  lines.push('', '## Quiz system', '');
  lines.push('- Per lesson: 3 MCQs, 2 scenarios and 1 real-life transfer question.');
  lines.push('- First pass: 75%; mastery: 90%; reviews: days ' + data.systems.quizSystem.reviewScheduleDays.join(', ') + '.');
  lines.push('- Missed items return with changed names, numbers and option order.');

  lines.push('', '## Investor License Program', '');
  data.licenses.forEach((license) => {
    lines.push('- **' + license.name + ':** ' + license.lessonsRequired + ' lessons, Modules 1–' + license.modulesRequiredThrough + ', readiness ' + license.minimumReadinessScore + '+, exam ' + license.exams.passPercent + '%, ' + license.practicalChallenges.length + ' practical defences.');
  });

  lines.push('', '## XP, readiness and portfolio health', '');
  lines.push('- XP rewards learning activity but never raises readiness directly.');
  lines.push('- Readiness: ' + data.systems.readinessScore.formula + '.');
  lines.push('- Portfolio health: ' + data.systems.portfolioHealth.formula + '.');
  lines.push('- Both scores expose inputs, confidence, caps and remediation; neither recommends a security.');

  lines.push('', '## Recommended sequence', '');
  data.systems.recommendedLearningSequence.forEach((item, index) => lines.push((index + 1) + '. ' + item));

  lines.push('', '## Files and maintenance', '');
  lines.push('- vestiquo-curriculum.json is the canonical product artifact.');
  lines.push('- Run npm run curriculum:build to regenerate it.');
  lines.push('- Run npm run curriculum:validate to enforce completeness and content rules.');
  lines.push('- Real-market snapshots must be sourced and date-labelled before publishing.');
  lines.push('');
  return lines.join('\n');
}

const outDir = path.join(__dirname, '..', 'curriculum');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'vestiqo-curriculum.json'), JSON.stringify(curriculum, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(outDir, 'README.md'), buildReadme(curriculum), 'utf8');

console.log(
  'Built Vestiqo curriculum v' + curriculum.schemaVersion + ': ' +
  curriculum.totals.modules + ' modules, ' +
  curriculum.totals.lessons + ' lessons, ' +
  curriculum.totals.lessonQuizQuestions + ' questions, ' +
  curriculum.totals.labs + ' labs and ' +
  curriculum.totals.licenses + ' licenses.',
);
