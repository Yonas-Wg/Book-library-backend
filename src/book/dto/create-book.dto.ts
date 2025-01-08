import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'The ISBN of the book', example: '9780743273565' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ description: 'Read status of the book', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  readStatus?: boolean;

  @ApiProperty({ description: 'User rating for the book', example: 5, required: false })
  @IsOptional()
  @IsNumber()
  userRating?: number;

  @ApiProperty({ description: 'Personal notes about the book', example: 'A must-read classic', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
