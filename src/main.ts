import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(helmet());
  app.enableCors({
    origin: config.get<string>('FRONTEND_ORIGIN', 'http://localhost:5173').split(',').map(v => v.trim()),
    methods: ['GET', 'OPTIONS'],
  });
  app.setGlobalPrefix(config.get<string>('API_PREFIX', 'api'));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, forbidNonWhitelisted: true, transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  const swagger = new DocumentBuilder().setTitle('Unsplash Search API')
    .setDescription('Backend proxy for Unsplash photo search').setVersion('1.0.0').build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));
  await app.listen(config.get<number>('PORT', 3000));
}
void bootstrap();
