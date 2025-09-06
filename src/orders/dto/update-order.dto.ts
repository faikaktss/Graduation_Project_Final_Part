import {IsEnum, IsOptional} from 'class-validator';

export enum OrderStatusDto{
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export class UpdateOrderDto{
    @IsOptional()
    @IsEnum(OrderStatusDto)
    status?:OrderStatusDto;
}