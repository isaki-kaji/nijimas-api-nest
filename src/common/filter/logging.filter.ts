import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class LoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingFilter.name);

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
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : exception?.message || 'Internal server error',
    };

    this.logger.error(
      `Exception - Trace ID: ${traceId}, message: ${exception.message}`,
    );
    this.logger.error(
      `Exception - Trace ID: ${traceId}, stack: ${exception.stack}`,
    );
    this.logger.log(
      `Response - Trace ID: ${traceId}, Status: ${status}, URL: ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}
