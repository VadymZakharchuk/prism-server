import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private jwtService: JwtService,
              private reflector: Reflector) {}

  private UserUnAuthorised() {
    throw new HttpException('jwtService error', HttpStatus.UNAUTHORIZED)
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() // obtaining of request object
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass
      ])
      if(!requiredRoles) {
        return true
      }
      const authHeader = req.headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]
      if( bearer !== 'Bearer' || !token) {
        this.UserUnAuthorised()
        return false
      } else {
        const userData = this.jwtService.verify(token)
        req.user = userData
        return userData.roles.some((role) => requiredRoles.includes(role.value))
      }
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new HttpException('Token expired', 498)
      } else {
        throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN)
      }
    }
  }

}
