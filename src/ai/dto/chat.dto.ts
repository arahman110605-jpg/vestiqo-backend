import { IsString, IsUUID, MinLength } from 'class-validator';

export class ChatDto {
  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(1)
  message: string;
}
