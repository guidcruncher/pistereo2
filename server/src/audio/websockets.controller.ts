eimport { Public } from '@auth/decorators'
import { Logger, Controller, MessageEvent, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { fromEvent, map, Observable } from 'rxjs'
import { WebsocketService } from './websocket.service'

@Public()
@Controller('/ws')
export class WebsocketsController {
  private readonly logger: Logger = new Logger(WebsocketsController.name, {
    timestamp: true,
  })

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly websocketService: WebsocketService,
  ) {}

  @Sse('/player')
  async ssePlayer(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'player').pipe(
      map((payload) => {
        this.logger.debug('Sending SSE Event ' + JSON.stringify(payload))
        return { data: JSON.stringify(payload) } as MessageEvent
      }),
    )
  }
}
