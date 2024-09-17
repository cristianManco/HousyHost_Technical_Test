import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CharacterService } from '../service/character.service';

@Injectable()
export class CharacterSyncService {
  private readonly logger = new Logger(CharacterSyncService.name);

  constructor(private readonly characterService: CharacterService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncCharacters() {
    this.logger.log('Cron job started: syncCharacters');
    try {
      await this.characterService.fetchAndSaveCharacters();
      this.logger.log('Characters synced successfully');
    } catch (error) {
      this.logger.error('Error syncing Characters', error.stack);
      throw new HttpException(
        'Error syncing Characters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.logger.log('Cron job finished: syncCharacters');
  }
}
