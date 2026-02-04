import { IsString, IsDate, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CompetitionType {
    SOLO = 'SOLO',
    ONE_V_ONE = 'ONE_V_ONE',
    GROUP = 'GROUP',
    GLOBAL = 'GLOBAL',
}

export class CreateCompetitionDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(CompetitionType)
    type: CompetitionType;

    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @Type(() => Date)
    @IsDate()
    endTime: Date;

    @IsNumber()
    @IsOptional()
    prizePool?: number;

    @IsNumber()
    @IsOptional()
    entryFee?: number;
}
