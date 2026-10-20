import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [HttpModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      timeout: config.get<number>('UNSPLASH_TIMEOUT_MS', 8000), maxRedirects: 3,
    }),
  })],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
