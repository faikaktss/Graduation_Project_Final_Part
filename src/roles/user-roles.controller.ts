import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user-roles')
export class UserRolesController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async assignRole(@Body() body: { userId: number; roleId: number }) {
    return this.prisma.userRole.create({
      data: {
        userId: body.userId,
        roleId: body.roleId,
      },
    });
  }

  @Get(':id')
  async getUserRoles(@Param('id') id: string) {
    return this.prisma.userRole.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        role: true,
      },
    });
  }

  @Delete()
  async removeRole(@Body() body: { userId: number; roleId: number }) {
    return this.prisma.userRole.deleteMany({
      where: {
        userId: body.userId,
        roleId: body.roleId,
      },
    });
  }
}
