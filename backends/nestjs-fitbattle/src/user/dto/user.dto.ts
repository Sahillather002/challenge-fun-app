import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    height?: string;

    @IsString()
    @IsOptional()
    weight?: string;

    @IsString() // Using IsString for now because the UI sends strings like "28" or "180", but better to handle conversion
    @IsOptional()
    age?: string | number;
}
