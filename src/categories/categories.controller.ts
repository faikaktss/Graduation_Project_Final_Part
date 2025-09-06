import { Controller,Post,Get,Patch,Delete,Param,Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';


@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService:CategoriesService){}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    async findAll(){
    return this.categoriesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id:number){
        return this.categoriesService.findOne(Number(id));
    }

    @Patch(':id')
    async update(@Param('id') id:string ,@Body() updateCategoryDto:CreateCategoryDto){
        return this.categoriesService.update(Number(id), updateCategoryDto);
    }
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoriesService.remove(Number(id));
    }

}
