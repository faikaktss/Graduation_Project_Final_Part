import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prismaa/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [PrismaModule],
})
export class UsersModule {}
