import { Controller,Get,Param,Patch,Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from 'src/auth/permissions.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}
    
    @Permission('users:read:any')
    @Get()  
    async findAll(){
        return this.userService.findAll();
    }

    @Permission('users:read:any')
    @Get(':id')
    async findOne(@Param('id') id:string){
        return this.userService.findOne(Number(id));
    }

    @Permission('users:update:own')
    @Patch(':id')   
    async update(@Param('id') id:string, @Body() updateUserDto:UpdateUserDto){  
        return this.userService.update(Number(id), updateUserDto);
    }
}
