import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class FitnessSyncRequestDto {
  @IsString()
  user_id: string;

  @IsString()
  competition_id: string;

  @IsNumber()
  steps: number;

  @IsNumber()
  distance: number;

  @IsNumber()
  calories: number;

  @IsNumber()
  active_minutes: number;

  @IsString()
  @IsOptional()
  source?: string = 'google_fit';

  @IsDateString()
  date: string;
}

export class ScoreUpdateRequestDto {
  @IsString()
  user_id: string;

  @IsString()
  competition_id: string;

  @IsNumber()
  steps: number;

  @IsNumber()
  distance: number;

  @IsNumber()
  calories: number;
}

export class CalculatePrizesRequestDto {
  @IsNumber()
  prize_pool: number;
}
