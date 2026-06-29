import { IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';

export class QuizAttemptDto {
  @IsUUID()
  quizId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsString()
  passed: string; // 'true' or 'false' from Flutter query params
}
