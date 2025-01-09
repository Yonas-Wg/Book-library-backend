import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new book, auto-fill data using Open Library API
 async create(createBookDto: CreateBookDto): Promise<Book> {
  if (!this.validateISBN(createBookDto.isbn)) {
    throw new BadRequestException('Invalid ISBN format');
  }

  // Fetch book data from Open Library API
  const bookData = await this.fetchBookByISBN(createBookDto.isbn);

  if (bookData) {
    const bookDetails = bookData[`ISBN:${createBookDto.isbn}`];

    if (!bookDetails) {
      throw new BadRequestException('Book data not found for the given ISBN');
    }

    // Construct the new book object
    const newBook = {
      title: bookDetails.title || createBookDto.title,
      author: bookDetails.authors?.[0]?.name || createBookDto.author,
      isbn: createBookDto.isbn,
      readStatus: createBookDto.readStatus,
      userRating: createBookDto.userRating,
      notes: createBookDto.notes,
    };

    // Save the new book to the database
    return this.prisma.book.create({
      data: newBook,
    });
  }

  throw new BadRequestException('Unable to fetch data from Open Library API');
}

async createManualBook(createBookDto: CreateBookDto): Promise<Book> {
    if (!this.validateISBN(createBookDto.isbn)) {
      throw new BadRequestException('Invalid ISBN format');
    }

    const newBook = {
      title: createBookDto.title,
      author: createBookDto.author,
      isbn: createBookDto.isbn,
      readStatus: createBookDto.readStatus,
      userRating: createBookDto.userRating,
      notes: createBookDto.notes,
    };

    return this.prisma.book.create({
      data: newBook,
    });
  }


  // Fetch book details from Open Library API using ISBN
  private async fetchBookByISBN(isbn: string) {
    try {
      const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      if (!response.data || !response.data[`ISBN:${isbn}`]) {
        throw new Error('No book data found for the provided ISBN');
      }
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error fetching book data from Open Library API: ' + (error.message || error));
    }
  }

  // Simple ISBN validation
  private validateISBN(isbn: string): boolean {
    const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/; // Basic ISBN regex for validation
    return isbnRegex.test(isbn);
  }

  // Get all books
  async findAll(skip: number = 0, take: number = 10): Promise<Book[]> {
    return this.prisma.book.findMany({ skip, take });
  }
  

  // Get a book by ID
  async findOne(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    if (updateBookDto.isbn) {
      const existingBook = await this.prisma.book.findUnique({
        where: {
          isbn: updateBookDto.isbn,
        },
      });
  
      // If the ISBN is found and it's not the current book being updated, throw an error
      if (existingBook && existingBook.id !== id) {
        throw new Error('ISBN must be unique and is already taken by another book.');
      }
    }

    const book = await this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  
    return book;
  }
  

  // Remove a book by ID
  async remove(id: string): Promise<void> {
    await this.prisma.book.delete({
      where: { id },
    });
  }
}
