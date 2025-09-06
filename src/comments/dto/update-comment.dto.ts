import { IsOptional, IsString, IsNumber,IsInt, Min,Max } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Max(5)
  @Min(1)
  rating?: number;
}