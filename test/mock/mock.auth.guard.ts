import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
  constructor(@Inject('TEST_UID') private readonly uid: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request['ownUid'] = this.uid;
    return true;
  }
}
