import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Character } from '../entities/character.entity';

@Injectable()
export class CharacterService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async fetchAndSaveCharacters(limit = 200): Promise<void> {
    const url = `https://rickandmortyapi.com/api/character`;
    let characters = [];

    try {
      let page = 1;
      while (characters.length < limit) {
        const { data } = await this.httpService
          .get(`${url}?page=${page}`)
          .toPromise();
        characters = [...characters, ...data.results];
        page++;
      }

      const limitedCharacters = characters.slice(0, limit);

      for (const char of limitedCharacters) {
        const existingCharacter = await this.characterRepository.findOne({
          where: { name: char.name },
        });

        if (!existingCharacter) {
          const characterEntity = this.characterRepository.create({
            name: char.name,
            status: char.status,
            species: char.species,
            gender: char.gender,
            location: char.location.name,
            image: char.image,
          });

          await this.characterRepository.save(characterEntity);
        }
      }
    } catch (error) {
      throw new HttpException(
        `Failed to fetch characters from API: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getCharacters(name?: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = name
        ? { where: { name: Like(`%${name}%`) }, skip, take: limit }
        : { skip, take: limit };

      return await this.characterRepository.find(query);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch characters: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
