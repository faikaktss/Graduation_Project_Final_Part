import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
       constructor(private readonly prisma: PrismaService) {}



    async create(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({ data: createCategoryDto });
    }

    async findAll() {
        return this.prisma.category.findMany({ orderBy: { order: 'asc' } });//orderBy karakterlerin nasıl sıralanacağını belirler
    }

    async findOne(id:number){
        return this.prisma.category.findUnique({where:{id}});
    }

    async update(id:number, updateCategoryDto:UpdateCategoryDto){
        return this.prisma.category.update({
            where:{id},
            data:updateCategoryDto,
        });
    }

    async remove(id:number) {
        return this.prisma.category.delete({where:{id}});
    }
}
