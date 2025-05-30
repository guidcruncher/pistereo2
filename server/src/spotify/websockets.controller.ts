import { User } from '@auth/decorators'
import { Public } from '@auth/decorators'
import { Controller, Logger, MessageEvent, Sse } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { Observable, fromEvent, map } from 'rxjs'
import * as crypto from 'crypto'
import { LibrespotClientService } from './librespot-client.service'

@Public()
@Controller('/ws')
export class WebsocketsController {
  constructor(
    private readonly librespotClientService: LibrespotClientService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  //  @Sse('/player')
  //  async ssePlayer(payload: any): Promise<Observable<MessageEvent>> {
  //   return fromEvent(this.eventEmitter, 'player').pipe(
  //      map((payload) => ({
  //        data: JSON.stringify(payload),
  //      })),
  //    );
  // }
}
