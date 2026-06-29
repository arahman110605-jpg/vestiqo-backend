import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStocks() {
    // Fetch all stocks and their latest price
    const stocks = await this.prisma.stock.findMany({
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
    const stock = await this.prisma.stock.findUnique({
      where: { ticker },
      include: {
        prices: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });
    return stock && stock.prices.length > 0 ? stock.prices[0].price : 0;
  }
}
