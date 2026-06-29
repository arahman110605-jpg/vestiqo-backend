import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketSyncService } from './market-sync.service';
import { MarketController } from './market.controller';

@Module({
  controllers: [MarketController],
  providers: [MarketService, MarketSyncService],
  exports: [MarketService, MarketSyncService],
})
export class MarketModule {}
