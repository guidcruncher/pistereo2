import { AuthModule } from '@auth/auth.module'
import { Module } from '@nestjs/common'

import { BaseService } from './base.service'
import { EventBaseService } from './event-base.service'
import { HttpTransportService } from './http-transport.service'
import { SocketCommunicatorService } from './socket-communicator.service'
import { WebsocketCommunicatorService } from './websocket-communicator.service'

@Module({
  imports: [AuthModule],
  providers: [
    HttpTransportService,
    SocketCommunicatorService,
    BaseService,
    EventBaseService,
    WebsocketCommunicatorService,
  ],
  exports: [
    HttpTransportService,
    SocketCommunicatorService,
    BaseService,
    EventBaseService,
    WebsocketCommunicatorService,
  ],
  controllers: [],
})
export class CoreModule {}
