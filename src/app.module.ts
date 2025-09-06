import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductPhotosModule } from './product-photos/product-photos.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { RolesModule } from './roles/roles.module';
import { UserRolesController } from './roles/user-roles.controller';
import { UserRolesModule } from './roles/UserRolesModule';
import { PermissionGuard } from './auth/guards/permission.guard';
@Module({
  imports: [
    UserRolesModule,
    RolesModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductPhotosModule,
    CommentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CartItemsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
