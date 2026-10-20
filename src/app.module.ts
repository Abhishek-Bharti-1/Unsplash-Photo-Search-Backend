import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { PhotosModule } from './photos/photos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, envFilePath: ['.env', '.env.local'] }),
    ThrottlerModule.forRoot([{
      ttl: Number(process.env.THROTTLE_TTL_MS ?? 60000),
      limit: Number(process.env.THROTTLE_LIMIT ?? 60),
    }]),
    HealthModule, PhotosModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
