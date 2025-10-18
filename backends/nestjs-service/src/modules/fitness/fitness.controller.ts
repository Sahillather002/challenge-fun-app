import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { FitnessSyncRequestDto } from '../../types/dto';
import { SuccessResponse } from '../../types/interfaces';

@Controller('fitness')
export class FitnessController {
  constructor(private readonly fitnessService: FitnessService) {}

  @Post('sync')
  async syncFitnessData(
    @Body() req: FitnessSyncRequestDto,
  ): Promise<SuccessResponse> {
    try {
      await this.fitnessService.syncFitnessData(req);

      return {
        success: true,
        message: 'Fitness data synced successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/:userId')
  async getUserStats(
    @Param('userId') userId: string,
    @Query('competition_id') competitionId: string,
  ): Promise<SuccessResponse> {
    try {
      if (!competitionId) {
        throw new HttpException(
          'Competition ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const stats = await this.fitnessService.getUserStats(
        userId,
        competitionId,
      );

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
