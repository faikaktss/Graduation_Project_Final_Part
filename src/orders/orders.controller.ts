import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Permission } from '../auth/permissions.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';


@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('orders')
export class OrdersController {
    constructor(private service: OrdersService) {}


    @Permission('orders:create')
    @Post()
    create(@CurrentUser() user: { id: number }) {
        return this.service.createFromCart(user.id);
    }



    @Permission('orders:read:own')
    @Get()
    list(@CurrentUser() user: { id: number }) {
        return this.service.findAll(user.id);
    }


    @Permission('orders:read:own')
    @Get(':id')
    getOne(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(user.id, id);
    }


    @Permission('orders:update:own')
    @Patch(':id')
    update(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
        return this.service.update(user.id, id, dto.status);
    }

    @Permission('orders:read:any')
    @Get('all')
    listAllForAdmin() {
        return this.service.findAllAdmin();
    }
}