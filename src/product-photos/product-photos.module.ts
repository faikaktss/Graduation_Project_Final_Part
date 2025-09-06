import { Module } from '@nestjs/common';
import { ProductPhotosController } from './product-photos.controller';
import { ProductPhotosService } from './product-photos.service';
import { PrismaModule } from 'src/prismaa/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProductPhotosController],
  providers: [ProductPhotosService, PrismaService],
  imports: [PrismaModule],
})
export class ProductPhotosModule {}
