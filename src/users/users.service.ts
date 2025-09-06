import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}
    async findAll(){
        return this.prisma.user.findMany();
    }

    async findOne(id:number){
        return this.prisma.user.findUnique({where: {id}});
    }

    async update(id:number, updateUserDto:UpdateUserDto){
        return this.prisma.user.update({
            where:{id},
            data:updateUserDto,
        });
    }
}
 