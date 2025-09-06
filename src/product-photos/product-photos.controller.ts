import { Controller,Post,Patch,Delete,Param,Body } from '@nestjs/common';
import { ProductPhotosService } from './product-photos.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';


@Controller('product-photos')
export class ProductPhotosController {
    constructor(private readonly productPhotosService: ProductPhotosService) {}

    @Post()
    async create(@Body() createProductPhotoDto : CreateProductPhotoDto){        
        return this.productPhotosService.create(createProductPhotoDto);
    }

    @Patch(':id')
    async update(@Param('id') id:string, @Body() UpdateProductPhotoDto:UpdateProductPhotoDto){
        return this.productPhotosService.update(Number(id), UpdateProductPhotoDto);
    }

    @Delete(':id')
    async remove(@Param('id') id:string){
        return this.productPhotosService.remove(Number(id));    
    }
}
