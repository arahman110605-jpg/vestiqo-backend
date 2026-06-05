import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { MarketService } from '../market/market.service';

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
    @Body() body: { userId: string; ticker: string; quantity: number; type: 'Buy' | 'Sell' }
  ) {
    // Fetch live price securely from backend
    const currentPrice = await this.marketService.fetchLivePrice(body.ticker);
    if (!currentPrice || currentPrice === 0) {
      throw new Error('Could not fetch price for ticker.');
    }

    return this.simulatorService.executeOrder(
      body.userId,
      body.ticker,
      body.quantity,
      body.type,
      currentPrice
    );
  }
}
