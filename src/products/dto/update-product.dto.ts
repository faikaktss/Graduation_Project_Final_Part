import { IsString, IsNumber, IsOptional ,IsInt, IS_OPTIONAL,Min} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  primaryPhotoUrl?: string;


  @IsInt()
  @IsOptional()
  @Min(0)
  stockQuantity?: number;
}