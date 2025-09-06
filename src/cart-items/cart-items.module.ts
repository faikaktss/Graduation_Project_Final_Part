import { Module } from "@nestjs/common";
import { CartItemsController } from "./cart-items.controller";
import { CartItemsService } from "./cart-items.service";
import { PrismaModule } from "src/prismaa/prisma.module";

@Module({
    imports:[PrismaModule],
    controllers:[CartItemsController],
    providers:[CartItemsService],
})
export class CartItemsModule {}