import { SetMetadata } from "@nestjs/common";
import { permission } from "process";
// endpointin başına hangi iznin gerekli olduğunu belirtmeye yarar
export const Permission = (permission: string) => SetMetadata('permission', permission);