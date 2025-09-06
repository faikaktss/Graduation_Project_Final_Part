import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductPhotoDto {
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
  @IsOptional()
  @IsNumber()
  order?: number;
}