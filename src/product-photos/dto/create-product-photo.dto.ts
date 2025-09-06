import { IsNumber,IsString ,IsOptional} from 'class-validator';

export class CreateProductPhotoDto {
  @IsNumber()
  productId: number;
  @IsString()
  url: string;
  @IsNumber()
  size: number;
  @IsOptional()
  isPrimary?: boolean;
}