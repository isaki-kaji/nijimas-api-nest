import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const traceId = request.traceId || 'N/A';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
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

    response.status(status).json(errorResponse);
  }
}
