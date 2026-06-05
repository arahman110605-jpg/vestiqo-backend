import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  async getStocks() {
    // Fetch all stocks and their latest price
    const stocks = await prisma.stock.findMany({
      include: {
        prices: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        }
      }
    });

    return stocks.map(s => ({
      id: s.id,
      ticker: s.ticker,
      name: s.name,
      sector: s.sector,
      currentPrice: s.prices.length > 0 ? s.prices[0].price : 0,
    }));
  }

  async fetchLivePrice(ticker: string): Promise<number> {
    const stock = await prisma.stock.findUnique({
      where: { ticker },
      include: {
        prices: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });
    return stock && stock.prices.length > 0 ? stock.prices[0].price : 0;
  }
}
