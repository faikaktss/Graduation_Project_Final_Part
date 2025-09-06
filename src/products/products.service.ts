import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}


    async create(createProductDto: CreateProductDto) {
        const data = {
            ...createProductDto,
            shortDescription: createProductDto.shortDescription ?? '',
            longDescription: createProductDto.longDescription ?? '',
            primaryPhotoUrl: createProductDto.primaryPhotoUrl ?? '',
        };
        return this.prisma.product.create({ data });
    }

    async findAll(q?:GetProductsQueryDto){
        const where: any = {};
        if(q?.category_id !== undefined) where.categoryId = q.category_id;
        if(q?.min_price !== undefined ||q?.max_price !== undefined){
            where.price = {};
            if(q.min_price !== undefined) where.price.gte = q.min_price;
            if(q.max_price !== undefined) where.price.lte = q.max_price;
        }
        let orderBy: any = {createdAt:'desc'};
        if(q?.sort ){
            const [field, dirRaw] = q.sort.split(':');
            const dir = dirRaw?.toLowerCase() === 'asc' ? 'asc' :'desc';
            const map: Record<string, string> ={
                price:'price',
                rating:'averageRating',
                createdAt:'createdAt',
            };
            const prismaField = map[field] ||'createdAt';
            orderBy= {[prismaField]:dir};

        }
        return this.prisma.product.findMany({where, orderBy});
    }

    async findOne(id:number){
        const product = await this.prisma.product.findUnique({
            where:{id},
            include:{
                photos:true, // ürüne ait foto
                comments:true,  // ürüne ait yorumlar
            },
        });
        if(!product){
            throw new NotFoundException('Ürün bulunamadi');
        }
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id:number){
        return this.prisma.product.delete({where:{id}});
    }
}
