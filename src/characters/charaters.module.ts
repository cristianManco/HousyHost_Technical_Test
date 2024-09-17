import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { CharacterService } from './service/character.service';
import { CharacterController } from './controller/character.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CharacterSyncService } from './cronjobs/cronjobs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  exports: [TypeOrmModule],
  controllers: [CharacterController],
  providers: [CharacterSyncService, CharacterService],
})
export class CharacterModule {}
