import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';   
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {addMinutes} from 'date-fns';
import {
BadRequestException,
UnauthorizedException,
NotFoundException,
ConflictException
} from '@nestjs/common';
import { randomUUID } from 'crypto';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}

    async generateTokens(userId:number, email: string,userRoles:any){
        const payload = { sub: userId, email ,userRoles};

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

            const refreshJwt = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
            });

            const jti = randomUUID();                      
            const rawRefresh = `${jti}.${refreshJwt}`;      
            const hashed = await bcrypt.hash(rawRefresh, 10); 

            await this.prisma.refreshToken.create({
            data: {
                userId,
                jti,
                hashedToken: hashed,           
                expiresAt: addMinutes(new Date(), 10080),
            },
            });

            return { accessToken, refreshToken: rawRefresh };
    }


    async refreshAccessToken(rawRefreshToken: string) {
    if (!rawRefreshToken) {
        throw new UnauthorizedException('Refresh token yok');
    }

    const token = String(rawRefreshToken).trim();
    if (/\{\{.*\}\}/.test(token)) {
        throw new BadRequestException('refreshToken değişkeni tanımlı değil ya da çözülmedi (Postman: {{refreshToken}}). Login yanıtından gelen gerçek token\'ı kullanın.');
    }
    const firstDot = token.indexOf('.');
    if (firstDot <= 0 || firstDot === token.length - 1) {
        throw new UnauthorizedException('Geçersiz refresh token formatı');
    }
    const jti = token.slice(0, firstDot);

        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { jti }, 
        });
    if (!tokenRecord) {
        throw new UnauthorizedException('Geçersiz refresh token');
    }

    const matches = await bcrypt.compare(token, tokenRecord.hashedToken);
    if (!matches) {
        await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } }); 
        throw new UnauthorizedException('Refresh token doğrulanamadı');
    }

    if (tokenRecord.expiresAt < new Date()) {
        await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        throw new UnauthorizedException('Süresi dolmuş refresh token');
    }

    const user = await this.prisma.user.findUnique({
        where: { id: tokenRecord.userId },
        include: { userRoles: true }, 
    });
    if (!user) {
        await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        throw new NotFoundException('Kullanıcı bulunamadı');
    }

    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(user.id, user.email, user.userRoles);

    return { accessToken, refreshToken: newRefreshToken };
    }   



    async register(registerDto:RegisterDto){
        const {firstName, lastName, email, password,username} = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        try{
        const user = await this.prisma.user.create({
            data:{
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                username,
                email,
                password: hashedPassword,
            },
            include: { userRoles: true }, // Include userRoles so it's available
        });

    const tokens = await this.generateTokens(user.id, user.email, user.userRoles);
    return { user, ...tokens };
    }catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Email veya kullanıcı adı zaten kullanılıyor');
      }
      throw e; 
    }
}

    async login(loginDto:LoginDto){
        const {email , password} = loginDto;

        const user = await this.prisma.user.findUnique({
        where: { email },
        include: { userRoles: true }, 
        });
        if(!user)
            throw new UnauthorizedException('Geçersiz e-posta veya şifre');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
            throw new UnauthorizedException('Geçersiz şifre');
    const tokens = await this.generateTokens(user.id, user.email, user.userRoles);
    return { user, ...tokens };
    }

    async me(userId:number){
        const user = await this.prisma.user.findUnique({  
        where:{id:userId},
        select:{
            id:true,
            firstName:true,
            lastName:true,
            fullName:true,
            email:true,
            username:true,
            createdAt:true,
        },
    });

    if(!user)
        throw new NotFoundException('Kullanici bulunamadi');

    return user;
    }

    async logout(userId:number, refreshToken:string){
        if(!refreshToken)
            throw new BadRequestException('refreshToken gerekli');
        const trimmed = String(refreshToken).trim();
        const firstDot = trimmed.indexOf('.');
        const jti = firstDot > 0 ? trimmed.slice(0, firstDot) : trimmed; 
        await this.prisma.refreshToken.deleteMany({
            where: {userId, jti},
        });
    return {message:'Çıkış yapildi'};
    }

    async logoutAll(userId:number){
        await this.prisma.refreshToken.deleteMany({where:{userId}});
        return {message:'Tüm oturumlardan çıkış yapıldı. Tüm tokenlar silindi'};
    }
}