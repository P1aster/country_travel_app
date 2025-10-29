import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError, TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;

    const message =
      exception instanceof Error ? exception.message : 'Database Error';

    this.logger.error('TypeORM Error:', message);

    response.status(status).json({
      error: 'Database Error',
      message: message,
      statusCode: status,
    });
  }
}
