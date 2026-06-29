import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async calculatePortfolioHealthScore(userId: string) {
    const account = await this.prisma.simulatorAccount.findUnique({
      where: { userId },
      include: { positions: { include: { stock: true } } }
    });

    if (!account || account.positions.length === 0) {
      return { score: 0, concentrationRisk: 0, volatility: 0, message: "No active positions." };
    }

    const totalPortfolioValue = account.positions.reduce(
      (sum, p) => sum + (p.quantity * p.averagePrice), 0
    ) + account.cashBalance;

    // Simulate Concentration Risk calculation (Max allowed in one stock is ideally < 20%)
    let maxConcentration = 0;
    account.positions.forEach(p => {
      const positionValue = p.quantity * p.averagePrice;
      const weight = positionValue / totalPortfolioValue;
      if (weight > maxConcentration) maxConcentration = weight;
    });

    // Score out of 100
    // Ideal: < 20% max concentration = 100 points for diversification.
    let diversificationScore = 100;
    if (maxConcentration > 0.20) {
      diversificationScore -= (maxConcentration - 0.20) * 100 * 2; // Penalize heavily
    }

    const finalScore = Math.max(0, Math.min(100, diversificationScore));

    // Upsert into DB
    await this.prisma.portfolioHealthScore.upsert({
      where: { userId },
      update: { score: finalScore, concentrationRisk: maxConcentration * 100 },
      create: { userId, score: finalScore, concentrationRisk: maxConcentration * 100 }
    });

    return { score: finalScore, maxConcentrationPercentage: maxConcentration * 100 };
  }

  async calculateIndexBenchmarking(userId: string) {
    // Example: Compare portfolio 30-day return vs NIFTY 50 30-day return
    const mockUserReturn = 12.5; // +12.5%
    const mockNiftyReturn = 8.2; // +8.2%
    
    return {
      portfolioReturn: mockUserReturn,
      nifty50Return: mockNiftyReturn,
      outperformance: mockUserReturn - mockNiftyReturn
    };
  }
}
