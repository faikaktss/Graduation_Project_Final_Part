import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
@Injectable()
export class RolesService{
    constructor(private prisma:PrismaService){}

    async createRole(name: string){
        return this.prisma.role.create({data:{name}})
    }

    async getAllRoles(){
        return this.prisma.role.findMany();
    }

    async addPermissionToRole(roleId:number, permissionKey:string){
        return this.prisma.rolePermission.create({
            data:{
                roleId,
                permissionKey
            }
        });
    }

    async getPermissionsOfRole(roleId: number) {
        return this.prisma.rolePermission.findMany({
            where: { roleId },
            select: { permissionKey: true },
        });
    }

    async removePermissionFromRole(roleId: number, permissionKey: string) {
        return this.prisma.rolePermission.deleteMany({
            where: { roleId, permissionKey },
        });
    }
}