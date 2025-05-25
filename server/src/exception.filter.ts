import { Logger } from 'nestjs-pino'
import {
  HttpStatus,
  HttpException,
  IntrinsicException,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception instanceof HttpException ? exception.message : 'Internal Server Error'

    this.logger.error('Error occured', exception)

    if (exception instanceof HttpException) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: message,
        path: request.url,
      })
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: message,
        error: exception,
        path: request.url,
      })
    }
  }
}
