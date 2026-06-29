import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { MarketService } from '../market/market.service';
import { TradeDto } from './dto/trade.dto';

@Controller('simulator')
export class SimulatorController {
  constructor(
    private readonly simulatorService: SimulatorService,
    private readonly marketService: MarketService,
  ) {}

  @Get('account/:userId')
  async getAccount(@Param('userId') userId: string) {
    return this.simulatorService.getSimulatorAccount(userId);
  }

  @Post('trade')
  async executeTrade(
    @Body() dto: TradeDto
  ) {
    // Fetch live price securely from backend
    const currentPrice = await this.marketService.fetchLivePrice(dto.ticker);
    if (!currentPrice || currentPrice === 0) {
      throw new Error('Could not fetch price for ticker.');
    }

    return this.simulatorService.executeOrder(
      dto.userId,
      dto.ticker,
      dto.quantity,
      dto.type,
      currentPrice
    );
  }
}
