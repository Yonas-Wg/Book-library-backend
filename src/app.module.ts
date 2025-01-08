import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [BookModule],
  providers: [PrismaService],
})
export class AppModule {}
