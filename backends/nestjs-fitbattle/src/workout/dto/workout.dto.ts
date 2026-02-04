import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateWorkoutDto {
    @IsString()
    exerciseType: string;

    @IsNumber()
    @IsOptional()
    reps?: number;

    @IsNumber()
    @IsOptional()
    duration?: number;

    @IsNumber()
    @IsOptional()
    calories?: number;

    @IsString()
    @IsOptional()
    competitionId?: string;
}
