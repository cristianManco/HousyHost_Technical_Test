import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from '../service/character.service';
import { Logger } from '@nestjs/common';
import { CharacterSyncService } from './cronjobs.service';
import { HttpService } from '@nestjs/axios';

describe('CharacterSyncService', () => {
  let service: CharacterSyncService;
  let characterService: CharacterService;
  let logger: Logger;

  const mockCharacterService = () => ({
    fetchAndSaveCharacters: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterSyncService,
        HttpService,
        {
          provide: CharacterService,
          useValue: mockCharacterService(),
        },
      ],
    }).compile();

    service = module.get<CharacterSyncService>(CharacterSyncService);
    characterService = module.get<CharacterService>(CharacterService);
    logger = new Logger(CharacterSyncService.name);
  });

  describe('syncCharacters', () => {
    it('should sync characters successfully', async () => {
      jest
        .spyOn(characterService, 'fetchAndSaveCharacters')
        .mockResolvedValue(undefined);

      await service.syncCharacters();

      // Check if the logs are correct
      expect(logger.log).toHaveBeenCalledWith(
        'Cron job started: syncCharacters',
      );
      expect(logger.log).toHaveBeenCalledWith('Characters synced successfully');
      expect(logger.log).toHaveBeenCalledWith(
        'Cron job finished: syncCharacters',
      );
    });

    it('should handle errors', async () => {
      jest
        .spyOn(characterService, 'fetchAndSaveCharacters')
        .mockRejectedValue(new Error('Service error'));
      const errorSpy = jest.spyOn(logger, 'error');

      await expect(service.syncCharacters()).rejects.toThrowError(
        'Error syncing Characters',
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Error syncing Characters',
        expect.any(String),
      );
    });
  });
});
