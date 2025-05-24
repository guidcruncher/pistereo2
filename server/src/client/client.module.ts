import { NestModule, RequestMethod, MiddlewareConsumer, Module } from '@nestjs/common'
import { ClientController } from './client.controller'
import { ClientMiddleware } from './client.middleware'

@Module({
  controllers: [],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientMiddleware).forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
