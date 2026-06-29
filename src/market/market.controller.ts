import { Controller, Get, Post } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketSyncService } from './market-sync.service';
import { Public } from '../auth/public.decorator';

@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    private readonly marketSyncService: MarketSyncService,
  ) {}

  @Get('stocks')
  async getStocks() {
    return this.marketService.getStocks();
  }

  @Public()
  @Post('sync')
  async syncPrices() {
    return this.marketSyncService.syncAllStocks();
  }

  @Public()
  @Post('seed')
  async seedStocks() {
    await this.marketSyncService.syncTopNseStocks();
    return { message: 'Top NSE stocks seeded successfully' };
  }
}
