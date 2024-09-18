import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from './character.controller';
import { CharacterService } from '../service/character.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CharacterController', () => {
  let controller: CharacterController;
  let service: CharacterService;

  const mockCharacterService = () => ({
    getCharacters: jest.fn(),
    fetchAndSaveCharacters: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        {
          provide: CharacterService,
          useValue: mockCharacterService(),
        },
      ],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
    service = module.get<CharacterService>(CharacterService);
  });

  describe('getCharacters', () => {
    it('should return characters successfully', async () => {
      const result = [{ name: 'Rick', status: 'Alive' }];
      jest.spyOn(service, 'getCharacters').mockResolvedValue(result as any);

      expect(await controller.getCharacters('Rick', 1, 10)).toEqual(result);
    });

    it('should throw HttpException on error', async () => {
      jest
        .spyOn(service, 'getCharacters')
        .mockRejectedValue(new Error('Service error'));

      await expect(
        controller.getCharacters('Rick', 1, 10),
      ).rejects.toThrowError(
        new HttpException(
          'Error fetching characters: Service error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('refreshCharacters', () => {
    it('should refresh characters successfully', async () => {
      jest
        .spyOn(service, 'fetchAndSaveCharacters')
        .mockResolvedValue(undefined);

      expect(await controller.refreshCharacters()).toEqual({
        message: 'Characters refreshed successfully',
      });
    });

    it('should throw HttpException on error', async () => {
      jest
        .spyOn(service, 'fetchAndSaveCharacters')
        .mockRejectedValue(new Error('Service error'));

      await expect(controller.refreshCharacters()).rejects.toThrowError(
        new HttpException(
          'Error refreshing characters: Service error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
