import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { Character } from '../entities/character.entity';

describe('CharacterService', () => {
  let service: CharacterService;
  let httpService: HttpService;
  let characterRepository: Repository<Character>;

  const mockCharacterRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  const mockHttpService = () => ({
    get: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        HttpService,
        HttpModule,
        {
          provide: HttpService,
          useValue: mockHttpService(),
        },
        {
          provide: Repository,
          useValue: mockCharacterRepository(),
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    httpService = module.get<HttpService>(HttpService);
    characterRepository = module.get<Repository<Character>>(Repository);
  });

  describe('fetchAndSaveCharacters', () => {
    it('should fetch and save characters successfully', async () => {
      const mockData: AxiosResponse = {
        data: {
          results: [
            {
              name: 'Rick Sanchez',
              status: 'Alive',
              species: 'Human',
              gender: 'Male',
              location: { name: 'Earth' },
              image: 'image_url',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockData));

      await service.fetchAndSaveCharacters();

      expect(characterRepository.create).toHaveBeenCalled();
      expect(characterRepository.save).toHaveBeenCalled();
    });
  });
});
