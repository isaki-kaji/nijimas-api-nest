import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const traceId = request.traceId || 'N/A';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      traceId,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `Exception - Trace ID: ${traceId}, Status: ${exception.status}, URL: ${request.url}, Message: ${exception.message}`,
    );
    this.logger.error(
      `Exception - Trace ID: ${traceId}, Stack: ${exception.stack}`,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
