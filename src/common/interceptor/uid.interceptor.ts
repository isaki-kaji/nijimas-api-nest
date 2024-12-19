import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UidInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<any>();
    if (request['ownUid']) {
      if (typeof request.body === 'object' && request.body !== null) {
        request.body.uid = request['ownUid'];
      }
    }
    return next.handle();
  }
}
