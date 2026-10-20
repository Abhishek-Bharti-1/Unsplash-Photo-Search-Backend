import { BadGatewayException, GatewayTimeoutException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SearchPhotosQueryDto } from './dto/search-photos-query.dto';
import type { UnsplashSearchResponse } from './interfaces/unsplash-response.interface';

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);
  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}

  async search(dto: SearchPhotosQueryDto): Promise<UnsplashSearchResponse> {
    const key = this.config.get<string>('UNSPLASH_ACCESS_KEY');
    if (!key) {
      this.logger.error('Unsplash access key is not configured');
      throw new ServiceUnavailableException('Photo search is not configured on the server.');
    }
    const params: Record<string, string | number> = {
      query: dto.query, page: dto.page ?? 1, per_page: dto.perPage ?? 24,
      order_by: dto.orderBy ?? 'relevant', content_filter: 'high',
    };
    if (dto.orientation) params.orientation = dto.orientation;

    try {
      const response = await firstValueFrom(this.http.get<UnsplashSearchResponse>(
        'https://api.unsplash.com/search/photos',
        { params, headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' } },
      ));
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          this.logger.warn('Unsplash request timed out');
          throw new GatewayTimeoutException('Unsplash took too long to respond. Try again.');
        }
        if (status === 429) {
          this.logger.warn('Unsplash rate limit reached');
          throw new ServiceUnavailableException('Unsplash rate limit reached. Try again later.');
        }
        if (status === 401 || status === 403) {
          this.logger.error(`Unsplash credentials rejected (HTTP ${status})`);
          throw new ServiceUnavailableException('Photo search is temporarily unavailable.');
        }
        this.logger.warn(`Unsplash request failed${status ? ` with HTTP ${status}` : ''}`);
      } else {
        this.logger.error('Unexpected error while searching Unsplash');
      }
      throw new BadGatewayException('Could not retrieve photos from Unsplash. Please try again.');
    }
  }
}
