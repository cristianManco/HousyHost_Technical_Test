import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import dbConfig from './libs/config/dbConfig';
import { CharacterModule } from './characters/charaters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig().database.host,
      port: dbConfig().database.port,
      username: dbConfig().database.username,
      password: dbConfig().database.password,
      database: dbConfig().database.db,
      autoLoadEntities: true,
      synchronize: false,
      extra: {
        ssl: false,
      },
    }),
    ScheduleModule.forRoot(),
    CharacterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
