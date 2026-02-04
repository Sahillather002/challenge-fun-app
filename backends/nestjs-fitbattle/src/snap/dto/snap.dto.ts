import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateStoryDto {
    @IsString()
    @IsNotEmpty()
    mediaUrl: string;

    @IsString()
    @IsNotEmpty()
    mediaType: string;

    @IsString()
    @IsOptional()
    caption?: string;
}

export class CreateSnapDto {
    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @IsString()
    @IsNotEmpty()
    mediaUrl: string;

    @IsString()
    @IsNotEmpty()
    mediaType: string;
}
