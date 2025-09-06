import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaModule } from 'src/prismaa/prisma.module';
import { UserRolesController } from './user-roles.controller';
@Module({
  imports: [PrismaModule],
  controllers: [RolesController,UserRolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
