import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const snowflake = SnowflakeId();

    const traceId = snowflake.generate();
    request.traceId = traceId;

    const method = request.method;
    const url = request.url;

    Logger.log(
      `Request - Trace ID: ${traceId}, Method: ${method}, URL: ${url}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        Logger.log(
          `Response - Trace ID: ${traceId}, Status: ${statusCode}, Duration: ${
            Date.now() - now
          }ms`,
        );
      }),
    );
  }
}
