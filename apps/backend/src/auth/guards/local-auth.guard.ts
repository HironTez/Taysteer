import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  override async canActivate(context: ExecutionContext) {
    // Check the email and the password
    const canActivate = await super.canActivate(context);

    // Initialize the session
    const request = context.switchToHttp().getRequest();
    super.logIn(request);

    return Boolean(canActivate);
  }
}
