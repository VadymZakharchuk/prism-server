import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() // obtaining of request object
    try {
      const authHeader = req.headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]
      if( bearer !== 'Bearer' || !token) {
        throw new HttpException('User unauthorized', 401)
      }
      req.user = this.jwtService.verify(token,
        { secret: process.env.SECRET_KEY })
      return true
    } catch (e) {
      console.log('Error in jwt-auth guard', e);
      throw new HttpException('Token expired', 498)
    }
  }

}
