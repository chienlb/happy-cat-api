import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RanksService } from './rank.service';
import { RankDocument } from './schema/rank.schema';

@Controller('ranks')
@ApiTags('Ranks')
@UseGuards(AuthGuard('jwt'))
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rank entry' })
  @ApiBody({
    description: 'Rank data for a user in a competition',
    schema: {
      type: 'object',
      properties: {
        idCompetition: { type: 'string', description: 'Competition id' },
        userId: { type: 'string', description: 'User id' },
        score: { type: 'number', description: 'Score of the user' },
        submittedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Submit time (optional, default now)',
        },
      },
      required: ['idCompetition', 'userId', 'score'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rank created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createRank(
    @Body()
    body: {
      idCompetition: string;
      userId: string;
      score: number;
      submittedAt?: Date;
    },
  ): Promise<RankDocument> {
    return this.ranksService.createRank(body);
  }

  @Get('competition/:competitionId/leaderboard')
  @ApiOperation({ summary: 'Get leaderboard of a competition' })
  @ApiParam({
    name: 'competitionId',
    type: String,
    description: 'Competition id',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of results (default 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard fetched successfully',
  })
  async getLeaderboard(
    @Param('competitionId') competitionId: string,
    @Query('limit') limit = 100,
  ): Promise<RankDocument[]> {
    const parsedLimit =
      typeof limit === 'string' ? parseInt(limit, 10) || 100 : limit;
    return this.ranksService.findLeaderboardByCompetition(
      competitionId,
      parsedLimit,
    );
  }

  @Get('competition/:competitionId/user/:userId')
  @ApiOperation({ summary: 'Get rank of a user in a competition' })
  @ApiParam({
    name: 'competitionId',
    type: String,
    description: 'Competition id',
  })
  @ApiParam({ name: 'userId', type: String, description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'User rank fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Rank not found for this user' })
  async getUserRankInCompetition(
    @Param('competitionId') competitionId: string,
    @Param('userId') userId: string,
  ): Promise<RankDocument> {
    return this.ranksService.findUserRankInCompetition(
      competitionId,
      userId,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all ranks of a user' })
  @ApiParam({ name: 'userId', type: String, description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'User ranks fetched successfully',
  })
  async getRanksByUser(
    @Param('userId') userId: string,
  ): Promise<RankDocument[]> {
    return this.ranksService.findAllByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a rank entry' })
  @ApiParam({ name: 'id', type: String, description: 'Rank id' })
  @ApiBody({
    description: 'Fields to update in rank',
    schema: {
      type: 'object',
      properties: {
        score: { type: 'number', description: 'New score' },
        rank: {
          type: 'number',
          description:
            'Override rank manually (optional, normally auto recalculated)',
        },
        submittedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Updated submit time',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Rank updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Rank not found' })
  async updateRank(
    @Param('id') id: string,
    @Body()
    body: {
      score?: number;
      rank?: number;
      submittedAt?: Date;
    },
  ): Promise<RankDocument> {
    return this.ranksService.updateRank(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rank entry' })
  @ApiParam({ name: 'id', type: String, description: 'Rank id' })
  @ApiResponse({
    status: 200,
    description: 'Rank deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Rank not found' })
  async deleteRank(@Param('id') id: string): Promise<RankDocument> {
    return this.ranksService.deleteRank(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rank by id' })
  @ApiParam({ name: 'id', type: String, description: 'Rank id' })
  @ApiResponse({ status: 200, description: 'Rank fetched successfully' })
  @ApiResponse({ status: 404, description: 'Rank not found' })
  async getRankById(@Param('id') id: string): Promise<RankDocument> {
    return this.ranksService.findById(id);
  }
}

