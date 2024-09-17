import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('/api'); // Global prefix for all routes
  app.enableCors();
  app.use(cors());

  const config = new DocumentBuilder()
    .setTitle('Rick and Morty Characters API')
    .setDescription(
      `
      API to manage Rick and Morty characters, with functionality to: \n
      - Load 200 initial characters from the public API to the PostgreSQL database 
      - List characters with filters by name and pagination 
      - Cron job to update the database automatically every 30 minutes 
      - Endpoint to manually refresh the database.

    `,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`The application is running on: http://localhost:${port}/api\n`);
  console.log(`Swagger documentation is at: http://localhost:${port}/api/docs`);
}

bootstrap();
