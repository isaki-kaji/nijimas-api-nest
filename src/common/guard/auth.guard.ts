import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_AUTH') private readonly authClient: admin.auth.Auth,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const bearerPrefix = 'Bearer ';
    if (!authorizationHeader.startsWith(bearerPrefix)) {
      throw new UnauthorizedException(
        'Authorization header must be a bearer token',
      );
    }

    const idToken = authorizationHeader.slice(bearerPrefix.length);

    try {
      const decodedToken = await this.authClient.verifyIdToken(idToken);
      request['ownUid'] = decodedToken.uid;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Failed to verify ID token');
    }
  }
}
