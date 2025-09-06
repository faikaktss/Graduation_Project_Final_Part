import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCartItemDto } from "./dto/create-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Injectable()
export class CartItemsService{
    constructor(private readonly prisma:PrismaService){}

    async add(userId: number, dto: CreateCartItemDto){
        const product = await this.prisma.product.findUnique({where:{id: dto.productId}});
        if(!product)
            throw new NotFoundException('Ürün bulunamadi');
        if(product.stockQuantity <= 0) 
            throw new BadRequestException('Stok yok')
        if(dto.quantity > product.stockQuantity)
            throw new BadRequestException('Yetersiz Stok')

        const existing = await this.prisma.cartItem.findUnique({//ürünü buluyoruz
            where:{userId_productId: {userId, productId: dto.productId}}
        }).catch(() => null);


        if(!existing){
            return this.prisma.cartItem.create({
                data:{userId, productId:dto.productId,quantity:dto.quantity},
            });
        }

        const newQty = existing.quantity + dto.quantity;
        if(newQty> product.stockQuantity) 
            throw new BadRequestException('Yetersiz stok');
        //miktarı güncelliyoruz
        return this.prisma.cartItem.update({
            where:{id:existing.id},
            data:{quantity:newQty},
        })


    }


    async list(userId:number){
        return this.prisma.cartItem.findMany({
            where:{userId},
            include:{product:true}, 
            orderBy:{createdAt: 'desc'},//küçükten büyüğe sıralamak
        });
    }


    async update(userId:number, id:number, dto:UpdateCartItemDto){
        const item = await this.prisma.cartItem.findUnique({where:{id}});
        if(!item ||item.userId !== userId)
            throw new NotFoundException('Sepette ürün bulunamadi');

        if(dto.quantity === 0){
            await this.prisma.cartItem.delete({where:{id}});
            return {message:'silindi'};
        }

        const product = await this.prisma.product.findUnique({where:{id:item.productId}});
        if(!product) throw new NotFoundException('Ürün bulunamadi');
        if(dto.quantity>product.stockQuantity) throw new BadRequestException('Yetersiz stok');

        return this.prisma.cartItem.update({where:{id}, data:{quantity:dto.quantity}});

    }


    async remove(userId:number,id:number){
        const item = await this.prisma.cartItem.findUnique({where:{id}});
        if(!item || item.userId !== userId) throw new NotFoundException('Sepet ögesi bulunamadi');
        await this.prisma.cartItem.delete({where:{id}});
        return {message:'Silindi'}; 
    }

    async clear(userId:number){
        await this.prisma.cartItem.deleteMany({where:{userId}});
        return {message:'Sepet temizlendi'};
    }
}