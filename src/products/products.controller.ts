import { Controller, Post, Get, Patch, Delete, Param, Body,ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Query } from '@nestjs/common';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import kaldırıldı, roller string olarak kullanılacak
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Permission } from 'src/auth/permissions.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Permission('products:create')
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Permission('products:read:any')
  @Get()
  async findAll(@Query() q:GetProductsQueryDto) {
    return this.productsService.findAll(q);
  }

  @Permission('products:read:any')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Permission('products:update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Permission('products:delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
  @Permission('products:create')
  @Post('with-permission')
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.productsService.create(createProductDto);
  }
}