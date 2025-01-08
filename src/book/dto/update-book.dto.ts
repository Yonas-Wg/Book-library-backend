import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: 'The ISBN of the book', example: '9780743273565', required: false })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiProperty({ description: 'Read status of the book', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  readStatus?: boolean;

  @ApiProperty({ description: 'User rating for the book', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  userRating?: number;

  @ApiProperty({ description: 'Personal notes about the book', example: 'A must-read classic', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
