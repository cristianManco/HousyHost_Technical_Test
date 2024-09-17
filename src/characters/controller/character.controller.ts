import {
  Controller,
  Get,
  Query,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CharacterService } from '../service/character.service';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Characters')
@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @ApiOperation({
    summary:
      'Retrieve all characters with pagination and optional filtering by name',
    description:
      'This endpoint allows you to retrieve a paginated list of characters. You can filter the results by name using the `name` query parameter.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter characters by name (optional)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of characters per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of characters retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while retrieving characters',
  })
  @Get('all')
  async getCharacters(
    @Query('name') name?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return await this.characterService.getCharacters(name, page, limit);
    } catch (error) {
      throw new HttpException(
        `Error fetching characters: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({
    summary: 'Manually refresh the character data',
    description:
      'This endpoint allows you to manually refresh the character data by fetching new characters from the Rick and Morty API and saving them to the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Characters refreshed successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while refreshing characters',
  })
  @Post('refresh')
  async refreshCharacters() {
    try {
      await this.characterService.fetchAndSaveCharacters();
      return { message: 'Characters refreshed successfully' };
    } catch (error) {
      throw new HttpException(
        `Error refreshing characters: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
