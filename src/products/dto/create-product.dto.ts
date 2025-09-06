import { IsNotEmpty, IsString, IsNumber, IsOptional ,IsInt ,Min} from "class-validator";

export class CreateProductDto {
    @IsNumber()
    categoryId: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string; 

    @IsString()
    @IsOptional()
    shortDescription?: string;

    @IsString()
    @IsOptional()
    longDescription?: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsOptional() 
    primaryPhotoUrl?: string;

    @IsInt()
    @Min(0)
    stockQuantity:number;
}

