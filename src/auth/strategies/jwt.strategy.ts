import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from '../../prisma/prisma.service';  
interface JwtPayload{
    sub: number;
    email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,"jwt"){
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_ACCESS_SECRET'), 
        });
    }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}