import { Public } from '@auth/decorators'
import { Controller, MessageEvent, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { fromEvent, map, Observable } from 'rxjs'

import { MpvClientService } from '../mpv/mpv-client.service'
import { LibrespotClientService } from '../spotify/librespot-client.service'

@Public()
@Controller('/ws')
export class WebsocketsController {
  constructor(
    private readonly librespotClientService: LibrespotClientService,
    private readonly mpvClientService: MpvClientService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Sse('/player')
  async ssePlayer(payload: any): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'player').pipe(
      map((payload) => ({
        data: JSON.stringify(payload),
      })),
    )
  }
}
