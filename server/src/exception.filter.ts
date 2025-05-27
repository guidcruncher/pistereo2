import {
  HttpStatus,
  HttpException,
  Logger,
  IntrinsicException,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name, { timestamp: true })

  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
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
