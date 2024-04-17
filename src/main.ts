import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
      allowedHeaders: '*',
      optionsSuccessStatus: 200,
    },
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === 'production',
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  const globalPrefix = 'api';
  SwaggerModule.setup(globalPrefix, app, document);

  await app.listen(3000);
}
const getSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle('Notification API Swagger')
    .setDescription('Notification Service API ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
bootstrap();
