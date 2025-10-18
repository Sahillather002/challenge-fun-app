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
import { LeaderboardService } from './leaderboard.service';
import {
  ScoreUpdateRequestDto,
  CalculatePrizesRequestDto,
} from '../../types/dto';
import { SuccessResponse } from '../../types/interfaces';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get(':competitionId')
  async getLeaderboard(
    @Param('competitionId') competitionId: string,
    @Query('limit') limit?: number,
  ): Promise<SuccessResponse> {
    try {
      const leaderboard = await this.leaderboardService.getLeaderboard(
        competitionId,
        limit || 100,
      );

      return {
        success: true,
        data: leaderboard,
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

  @Post('update')
  async updateScore(
    @Body() req: ScoreUpdateRequestDto,
  ): Promise<SuccessResponse> {
    try {
      await this.leaderboardService.updateScore(req);

      return {
        success: true,
        message: 'Score updated successfully',
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

@Controller('prizes')
export class PrizesController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post('calculate/:competitionId')
  async calculatePrizes(
    @Param('competitionId') competitionId: string,
    @Body() req: CalculatePrizesRequestDto,
  ): Promise<SuccessResponse> {
    try {
      const prizes = await this.leaderboardService.calculatePrizes(
        competitionId,
        req.prize_pool,
      );

      return {
        success: true,
        data: { prizes },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        error.message.includes('No participants')
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('distribute/:competitionId')
  async distributePrizes(
    @Param('competitionId') competitionId: string,
  ): Promise<SuccessResponse> {
    // Mock implementation - integrate with payment gateway
    return {
      success: true,
      message: `Prizes distribution initiated for competition ${competitionId}`,
    };
  }
}
