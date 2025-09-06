import { Controller,Post,Get,Body,UseGuards, BadRequestException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto} from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';   
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('refresh')
    async refresh(
        @Body() body: any,
        @Headers('x-refresh-token') headerRefresh?: string,
        @Headers('authorization') authHeader?: string,
    ){
        let refreshToken = (body?.refreshToken ?? body?.token ?? headerRefresh ?? '').toString().trim();
        if(!refreshToken && authHeader){
            const parts = authHeader.split(' ');
            if(parts.length === 2 && /^Bearer$/i.test(parts[0])){
                refreshToken = parts[1].trim();
            }
        }
        if(!refreshToken){
            throw new BadRequestException('refreshToken gerekli (body.refreshToken, body.token veya x-refresh-token header)');
        }
        return this.authService.refreshAccessToken(refreshToken);
    }

    @Post('register')
    async register(@Body() registerDto:RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto:LoginDto){
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user:{id: number ; email :string}){
        return user;
    }


    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@CurrentUser() user: {id:number},
                @Body('refreshToken') refreshToken: string){
            if(!refreshToken)
                throw new BadRequestException('Refresh token is required');
        return this.authService.logout(user.id, refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    async logoutAll(@CurrentUser() user:{id:number}){
        return this.authService.logoutAll(user.id);
    }

}
