import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service'; 
import { PrismaModule } from 'src/prismaa/prisma.module';
@Module({
  imports:[
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
      
    }),
    PrismaModule,
  ],
  controllers:[AuthController],
  providers:[
    AuthService,
    JwtStrategy,
    PrismaService,
  ],
  exports:[AuthService,]
})
export class AuthModule {}