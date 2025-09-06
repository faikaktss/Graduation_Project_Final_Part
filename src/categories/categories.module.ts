import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from 'src/prismaa/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CategoriesService, PrismaService],
  controllers: [CategoriesController],
  imports: [PrismaModule],
})
export class CategoriesModule {}