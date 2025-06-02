import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

import { ClientMiddleware } from './client.middleware'

@Module({
  controllers: [],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientMiddleware).forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
