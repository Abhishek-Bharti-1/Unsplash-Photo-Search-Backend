import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPhotosQueryDto {
  @ApiProperty({ example: 'nature', minLength: 1, maxLength: 100 })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @MinLength(1) @MaxLength(100)
  query!: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 24, minimum: 1, maximum: 30 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(30)
  perPage = 24;

  @ApiPropertyOptional({ enum: ['landscape', 'portrait', 'squarish'] })
  @IsOptional() @IsIn(['landscape', 'portrait', 'squarish'])
  orientation?: 'landscape' | 'portrait' | 'squarish';

  @ApiPropertyOptional({ enum: ['relevant', 'latest'], default: 'relevant' })
  @IsOptional() @IsIn(['relevant', 'latest'])
  orderBy: 'relevant' | 'latest' = 'relevant';
}
