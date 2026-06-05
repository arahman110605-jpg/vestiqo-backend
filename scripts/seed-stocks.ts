import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialStocks = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', initialPrice: 175.50 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', initialPrice: 330.20 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', initialPrice: 135.40 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', initialPrice: 140.10 },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', initialPrice: 245.80 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', initialPrice: 450.00 },
  { ticker: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy', initialPrice: 2850.00 },
  { ticker: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Technology', initialPrice: 3950.00 },
  { ticker: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Financials', initialPrice: 1480.00 },
  { ticker: 'INFY.NS', name: 'Infosys Limited', sector: 'Technology', initialPrice: 1620.00 },
];

async function main() {
  console.log('🌱 Seeding Market Stocks...');

  for (const s of initialStocks) {
    let stock = await prisma.stock.findUnique({
      where: { ticker: s.ticker }
    });

    if (!stock) {
      stock = await prisma.stock.create({
        data: {
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
        }
      });
      console.log(`Created Stock: ${s.ticker}`);
    }

    // Insert a fresh baseline price
    await prisma.stockPrice.create({
      data: {
        stockId: stock.id,
        price: s.initialPrice,
      }
    });
  }

  console.log('✅ Market Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
