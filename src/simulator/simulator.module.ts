import { Module } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { SimulatorController } from './simulator.controller';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule],
  controllers: [SimulatorController],
  providers: [SimulatorService],
  exports: [SimulatorService],
})
export class SimulatorModule {}
