import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { SearchPhotosQueryDto } from './dto/search-photos-query.dto';
import { PhotosService } from './photos.service';
import type { UnsplashSearchResponse } from './interfaces/unsplash-response.interface';

@ApiTags('search')
@Controller('search')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}
  @Get('photos')
  @ApiOperation({ summary: 'Search Unsplash photos' })
  @ApiOkResponse({ description: 'Search results from Unsplash' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiTooManyRequestsResponse({ description: 'Rate limit exceeded' })
  search(@Query() query: SearchPhotosQueryDto): Promise<UnsplashSearchResponse> {
    return this.photosService.search(query);
  }
}
