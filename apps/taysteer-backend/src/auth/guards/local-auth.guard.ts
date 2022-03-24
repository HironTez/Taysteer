import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    // check the email and the password
    const canActivate = await super.canActivate(context);
    
    // initialize the session
    const request = context.switchToHttp().getRequest();
    super.logIn(request);

    return Boolean(canActivate);
  };
}