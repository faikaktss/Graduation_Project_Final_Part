import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/prismaa/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
  imports: [PrismaModule],
})
export class CommentsModule {}
