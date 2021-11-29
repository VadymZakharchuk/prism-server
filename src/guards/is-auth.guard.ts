import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class IsUserAuth implements CanActivate {

  private UserUnAuthorised() {
    throw new HttpException('Authorization required', HttpStatus.UNAUTHORIZED)
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() // obtaining of request object
    try {
      const authHeader = req.headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]
      if( bearer !== 'Bearer' || !token) {
        this.UserUnAuthorised()
        return false
      } else {
        return true
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
