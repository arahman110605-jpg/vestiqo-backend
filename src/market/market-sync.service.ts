import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface YahooFinanceResponse {
  chart?: {
    result?: Array<{
      meta: { regularMarketPrice: number; previousClose?: number };
    }>;
    error?: any;
  };
}

@Injectable()
export class MarketSyncService {
  private readonly logger = new Logger(MarketSyncService.name);
  private readonly YAHOO_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

  constructor(private readonly prisma: PrismaService) {}

  async syncAllStocks(): Promise<{ synced: number; failed: number }> {
    const stocks = await this.prisma.stock.findMany();
    let synced = 0;
    let failed = 0;

    for (const stock of stocks) {
      try {
        await this.syncStockPrice(stock.ticker, stock.id);
        synced++;
      } catch (err) {
        this.logger.warn(`Failed to sync ${stock.ticker}: ${err.message}`);
        failed++;
      }
    }

    this.logger.log(`Market sync complete: ${synced} synced, ${failed} failed`);
    return { synced, failed };
  }

  async syncStockPrice(ticker: string, stockId?: string): Promise<number> {
    const yahooTicker = ticker.includes('.') ? ticker : `${ticker}.NS`;
    const url = `${this.YAHOO_API}/${yahooTicker}?interval=1d&range=1d`;

    const response = await axios.get<YahooFinanceResponse>(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vestiqo/1.0)',
      },
    });

    const result = response.data?.chart?.result?.[0];
    if (!result) {
      throw new Error(`No data returned for ${ticker}`);
    }

    const price = result.meta.regularMarketPrice;
    if (!price || price <= 0) {
      throw new Error(`Invalid price for ${ticker}: ${price}`);
    }

    // Resolve stockId if not provided
    let resolvedStockId = stockId;
    if (!resolvedStockId) {
      const stock = await this.prisma.stock.findUnique({ where: { ticker } });
      if (!stock) throw new Error(`Stock ${ticker} not found in database`);
      resolvedStockId = stock.id;
    }

    await this.prisma.stockPrice.create({
      data: {
        stockId: resolvedStockId!,
        price,
      },
    });

    return price;
  }

  async syncTopNseStocks(): Promise<void> {
    const topNseTickers = [
      'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
      'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK',
      'LT', 'BAJFINANCE', 'HCLTECH', 'AXISBANK', 'MARUTI',
      'TATAMOTORS', 'SUNPHARMA', 'TITAN', 'ULTRACEMCO', 'ONGC',
      'WIPRO', 'NTPC', 'M&M', 'POWERGRID', 'ADANIENT',
      'ADANIPORTS', 'COALINDIA', 'NESTLEIND', 'ASIANPAINT', 'BAJAJFINSV',
      'BRITANNIA', 'CIPLA', 'TATASTEEL', 'TECHM', 'GRASIM',
      'JSWSTEEL', 'DRREDDY', 'HEROMOTOCO', 'HINDALCO', 'INDUSINDBK',
      'TATACONSUM', 'APOLLOHOSP', 'EICHERMOT', 'DIVISLAB', 'BAJAJ-AUTO',
    ];

    for (const ticker of topNseTickers) {
      const exists = await this.prisma.stock.findUnique({ where: { ticker } });
      if (!exists) {
        await this.prisma.stock.create({
          data: { ticker, name: ticker, sector: 'NSE' },
        });
        this.logger.log(`Seeded stock: ${ticker}`);
      }
    }
  }
}
