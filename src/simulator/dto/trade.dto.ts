import { IsIn, IsInt, IsNumber, IsString, Min } from 'class-validator';

export class TradeDto {
  @IsString()
  userId: string;

  @IsString()
  ticker: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsIn(['Buy', 'Sell'])
  type: 'Buy' | 'Sell';

  @IsNumber()
  @Min(0)
  currentPrice: number;
}
