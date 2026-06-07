import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SimulatorService {
  
  async getSimulatorAccount(userId: string) {
    let account = await prisma.simulatorAccount.findUnique({
      where: { userId },
      include: { positions: { include: { stock: true } } },
    });

    if (!account) {
      // For prototype: Ensure the mock user exists to satisfy foreign key constraint
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        await prisma.user.create({
          data: {
            id: userId,
            email: `${userId}@vestiqo.com`,
            supabaseAuthId: `auth-${userId}`,
            profile: {
              create: {
                displayName: 'Test User',
                experienceLevel: 'Beginner',
                xp: 250,
                level: 1
              }
            }
          }
        });
      }

      // Provision the initial account with ₹10,00,000
      account = await prisma.simulatorAccount.create({
        data: { userId, cashBalance: 1000000.0 },
        include: { positions: { include: { stock: true } } },
      });
    }
    return account;
  }

  async executeOrder(userId: string, ticker: string, quantity: number, type: 'Buy' | 'Sell', currentPrice: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer.');
    }

    const account = await this.getSimulatorAccount(userId);
    const orderCost = quantity * currentPrice;
    
    const stock = await prisma.stock.findUnique({ where: { ticker } });
    if (!stock) throw new BadRequestException('Stock not found');

    if (type === 'Buy') {
      if (account.cashBalance < orderCost) {
        throw new BadRequestException('Insufficient virtual funds.');
      }

      // Check if position already exists
      const existingPosition = account.positions.find(p => p.stockId === stock.id);

      await prisma.$transaction(async (tx) => {
        // Deduct Cash
        await tx.simulatorAccount.update({
          where: { id: account.id },
          data: { cashBalance: account.cashBalance - orderCost }
        });

        // Record Order
        await tx.simulatorOrder.create({
          data: { accountId: account.id, ticker, type, quantity, price: currentPrice, status: 'Executed' }
        });

        // Upsert Position
        if (existingPosition) {
          const newQuantity = existingPosition.quantity + quantity;
          const newAvgPrice = ((existingPosition.quantity * existingPosition.averagePrice) + orderCost) / newQuantity;
          
          await tx.simulatorPosition.update({
            where: { id: existingPosition.id },
            data: { quantity: newQuantity, averagePrice: newAvgPrice }
          });
        } else {
          await tx.simulatorPosition.create({
            data: { accountId: account.id, stockId: stock.id, quantity, averagePrice: currentPrice }
          });
        }
      });
      return { success: true, message: `Successfully bought ${quantity} shares of ${ticker}.` };
    } 
    
    if (type === 'Sell') {
      const existingPosition = account.positions.find(p => p.stockId === stock.id);
      if (!existingPosition || existingPosition.quantity < quantity) {
        throw new BadRequestException('Insufficient shares to sell.');
      }

      await prisma.$transaction(async (tx) => {
        // Add Cash
        await tx.simulatorAccount.update({
          where: { id: account.id },
          data: { cashBalance: account.cashBalance + orderCost }
        });

        // Record Order
        await tx.simulatorOrder.create({
          data: { accountId: account.id, ticker, type, quantity, price: currentPrice, status: 'Executed' }
        });

        // Update or Delete Position
        const newQuantity = existingPosition.quantity - quantity;
        if (newQuantity === 0) {
          await tx.simulatorPosition.delete({ where: { id: existingPosition.id } });
        } else {
          await tx.simulatorPosition.update({
            where: { id: existingPosition.id },
            data: { quantity: newQuantity }
          });
        }
      });

      return { success: true, message: `Successfully sold ${quantity} shares of ${ticker}.` };
    }
  }
}
