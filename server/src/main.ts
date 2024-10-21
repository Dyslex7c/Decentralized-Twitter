import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    methods: ["GET", "POST"],
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
