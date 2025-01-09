import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    if (!createBookDto.readStatus || typeof createBookDto.readStatus !== 'boolean') {
      throw new BadRequestException('Invalid read status');
    }
    return this.bookService.create(createBookDto);
  }

  @Post('manual')
  async createManual(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createManualBook(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all books' })
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a book by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the book',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async findOne(@Param('id') id: string): Promise<Book> {
    try {
      return await this.bookService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book', example: '550e8400-e29b-41d4-a716-446655440000' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      return await this.bookService.update(id, updateBookDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book', example: '550e8400-e29b-41d4-a716-446655440000' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.bookService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw error;
    }
  }
}
