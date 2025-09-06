import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (_data : unknown , ctx:ExecutionContext) =>{
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);