import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authenticated = request.isAuthenticated();
    if (!authenticated) throw new UnauthorizedException();
    return authenticated;
  }
}
