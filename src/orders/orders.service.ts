import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrdersService{
    constructor(private prisma:PrismaService){}

    private isPrivileged(user: { userRoles?: any[] }) {
        // user.userRoles: [{ role: { name: string } }]
        if (!user.userRoles) return false;
        return user.userRoles.some(ur => ur.role.name === 'ADMIN' || ur.role.name === 'MODERATOR');
    }

    async findOneOrAdmin(user: {id:number; userRoles?: any[]}, id:number){
        const order = await this.prisma.order.findUnique({
            where:{id},
            include:{items:{include:{product:true}}},
    });

    if(!order) throw new NotFoundException('Siparis bulunamadi');

    if(this.isPrivileged(user)) return order;
    if(order.userId !== user.id ) throw new NotFoundException('Siparis bulunamadi');
    return order;
    }


    async updateOrAdmin(user: {id:number;userRoles?: any[]}, id:number, status?: string){
        const order = await this.prisma.order.findUnique({where:{id}});
        if(!order) throw new NotFoundException('Siparis bulunamadi');
        
    if(!this.isPrivileged(user) && order.userId !== user.id)
            throw new NotFoundException('Siparis bulunamadi');

        if(!status)
            return this.findOneOrAdmin(user,id);
        return this.prisma.order.update({
            where:{id},
            data:{status: status as any},
        });
}

    async createFromCart(userId:number){
        const cart = await this.prisma.cartItem.findMany({
            where:{userId},
            include:{product:true},
        });
        if(cart.length === 0 ) throw new BadRequestException('Sepet boş');

        let total = 0;
        for(const ci of cart){
            if(ci.product.stockQuantity<ci.quantity)    
                throw new BadRequestException(`Ürün stokta yok: ${ci.product.name}`);
        
            total += ci.quantity * ci.product.price;
        }
        //yeni sipariş kaydı moruk
        const created = await this.prisma.$transaction(async (tx) =>{
            const order = await tx.order.create({
                data:{userId, totalPrice:total, status:'PENDING'},
            });

            for(const ci of cart){
                    await tx.orderItem.create({
                        data:{
                            orderId:order.id,   
                            productId:ci.productId,
                            quantity:ci.quantity,
                            unitPrice:ci.product.price,
                    },
                });
                await tx.product.update({
                    where:{id:ci.productId},
                    data:{stockQuantity:{decrement:ci.quantity}},
                });
            
            }

            await tx.cartItem.deleteMany({ where: { userId } });
            return order;
        });
        return this.findOne(userId,created.id);

    }

    async findAll(userId:number){
        return this.prisma.order.findMany({
            where:{userId},
            include:{items:{include:{product:true}}},
            orderBy:{createdAt:'desc'},
        });
    }




    async findAllAdmin(){
        return this.prisma.order.findMany({
            include:{user:true, items: {include: {product:true}}},
            orderBy: {createdAt: 'desc'},
        });
    }

    async findOne(userId:number,id:number){
        const order = await this.prisma.order.findUnique({
            where:{id},
            include:{items: {include:{product:true}}},
        });
        if(!order ||order.userId !== userId) throw new NotFoundException('Sipariş bulunamadi');
        return order;
    }

    async update(userId:number, id:number, status?:string){
        const order = await this.prisma.order.findUnique({where:{id}});
        if(!order||order.userId !== userId) throw new NotFoundException('Siparis bulunamadi');
        if(!status) return order
        return this.prisma.order.update({where:{id}, data:{status: status as any}});
    }




}