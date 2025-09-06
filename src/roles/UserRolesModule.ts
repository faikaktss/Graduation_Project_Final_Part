import { Module } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { PrismaModule } from 'src/prismaa/prisma.module';
@Module({
  imports: [PrismaModule], // Sadece module'lar burada olur
  controllers: [UserRolesController], // Controller burada olmalı
})
export class UserRolesModule {}