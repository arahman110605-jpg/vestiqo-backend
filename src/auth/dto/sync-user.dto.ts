import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SyncUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  displayName?: string;
}
