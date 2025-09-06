import {IsInt, Min} from 'class-validator';

export class UpdateCartItemDto{
    @IsInt()
    @Min(0)
    quantity:number;
}