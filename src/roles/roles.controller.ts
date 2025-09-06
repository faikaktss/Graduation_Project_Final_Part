import { Controller } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Post, Body ,Get,Param} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Controller('roles')

export class RolesController{
    constructor(private rolesService:RolesService){}

    @Post()
    async create(@Body('name') name:String){
        return this.rolesService.createRole(name as string);
    }

    @Get()  
    async findAll(){
        return this.rolesService.getAllRoles();
    }

    @Post(':roleId/permissions')
    async addPermission(
        @Param('roleId') roleId:number, @Body('permissionKey') permissionKey:string,
    ){
        return this.rolesService.addPermissionToRole(Number(roleId),permissionKey);
    }
    @Get(':roleId/permissions')
    async getPermissions(@Param('roleId') roleId: number) {
        return this.rolesService.getPermissionsOfRole(Number(roleId));
    }

    @Post(':roleId/permissions/remove')
    async removePermission(
        @Param('roleId') roleId: number,
        @Body('permissionKey') permissionKey: string,
    ) {
        return this.rolesService.removePermissionFromRole(Number(roleId), permissionKey);
    }
}
