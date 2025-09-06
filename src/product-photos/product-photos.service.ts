import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {CreateProductPhotoDto} from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductPhotosService {
   constructor(private readonly prisma: PrismaService) {}

  async create(dto:CreateProductPhotoDto){
    const {productId, url ,size,isPrimary } = dto; 

    const MAX_RETRIES = 3;
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const count = await tx.productPhoto.count({ where: { productId } });
          const nextOrder = count + 1;

          const shouldBePrimary = isPrimary === true || count === 0;

          if (shouldBePrimary) {
            await tx.productPhoto.updateMany({
              where: { productId, isPrimary: true },
              data: { isPrimary: false }
            });
          }

          const photo = await tx.productPhoto.create({
            data: {
              productId,
              url,
              size,
              order: nextOrder,
              isPrimary: shouldBePrimary,
            },
          });

          if (shouldBePrimary) {
            await tx.product.update({
              where: { id: productId },
              data: { primaryPhotoUrl: photo.url },
            });
          }
          return photo;
        });
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          attempt++;
          if (attempt >= MAX_RETRIES) {
            throw new BadRequestException('Fotoğraf sırası oluşturulurken tekrar denemeler başarısız oldu.');
          }
          continue; 
        }
        throw e; 
      }
    }
    throw new BadRequestException('Fotoğraf oluşturulamadı.');
  }

    async update(id: number, dto: UpdateProductPhotoDto) {
  return this.prisma.$transaction(async (tx) => {
    const photo = await tx.productPhoto.findUnique({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Fotoğraf bulunamadı');
    }

    const { productId } = photo;
    const { order: newOrderRaw, isPrimary } = dto;

    const count = await tx.productPhoto.count({ where: { productId } });

    let finalOrder = photo.order;

    if (newOrderRaw !== undefined && newOrderRaw !== photo.order) {
      if (newOrderRaw < 1) {
        throw new BadRequestException('order en az 1 olmalı');
      }

      let newOrder = newOrderRaw;
      if (newOrder > count) {
        newOrder = count; 
      }

      if (newOrder !== photo.order) {
        if (newOrder < photo.order) {
          await tx.productPhoto.updateMany({
            where: {
              productId,
              order: { gte: newOrder, lt: photo.order },
            },
            data: { order: { increment: 1 } },
          });
        } else {
          await tx.productPhoto.updateMany({
            where: {
              productId,
              order: { gt: photo.order, lte: newOrder },
            },
            data: { order: { decrement: 1 } },
          });
        }
        finalOrder = newOrder;
      }
    }

    let finalIsPrimary = photo.isPrimary;

    if (isPrimary === true && !photo.isPrimary) {
      await tx.productPhoto.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
      finalIsPrimary = true;

      await tx.product.update({
        where: { id: productId },
        data: { primaryPhotoUrl: photo.url },
      });
    } else if (isPrimary === false && photo.isPrimary) {
      if (count === 1) {
        throw new BadRequestException('Tek fotoğraf primary olmadan kalamaz');
      }
      const replacement = await tx.productPhoto.findFirst({
        where: { productId, id: { not: id } },
        orderBy: { order: 'asc' },
      });
      if (replacement) {
        await tx.productPhoto.update({
          where: { id: replacement.id },
          data: { isPrimary: true },
        });
        await tx.product.update({
          where: { id: productId },
          data: { primaryPhotoUrl: replacement.url },
        });
        finalIsPrimary = false;
      }
    }

    const updated = await tx.productPhoto.update({
      where: { id },
      data: {
        order: finalOrder,
        isPrimary: finalIsPrimary,
      },
    });

    return updated;
  });
}

    async remove(id:number){
        return this.prisma.$transaction(async(tx) =>{
            const photo = await tx.productPhoto.findUnique({where:{id}});
            if(!photo)
                throw new NotFoundException('Fotoğraf bulunamadi');

            const {productId, order: deletedOrder, isPrimary} = photo;

            await tx.productPhoto.delete({where:{id}});

            await tx.productPhoto.updateMany({
                where:{productId, order: {gt:deletedOrder}},
                data:{order:{decrement:1}},
            });

            if(isPrimary){  
                const replacement = await tx.productPhoto.findFirst({
                    where: {productId},
                    orderBy: {order:'asc'},
                });
                if(replacement){
                    await tx.productPhoto.update({
                        where:{id:replacement.id},
                        data:{isPrimary:true},
                    });
                    await tx.product.update({
                        where:{id:productId},
                        data:{primaryPhotoUrl:replacement.url},
                    })
                }
            }
        })
    }
}
