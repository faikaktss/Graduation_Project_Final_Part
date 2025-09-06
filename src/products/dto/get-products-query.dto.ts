import {IsInt, IsNumber, IsOptional, IsString, Min} from 'class-validator';
import { Type } from 'class-transformer';


export class GetProductsQueryDto{
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) category_id ?:number;
    @IsOptional() @Type(() => Number) @IsNumber() min_price ?: number;
    @IsOptional() @Type(() => Number) @IsNumber() max_price ?: number;
    @IsOptional() @IsString() sort?: string;
}