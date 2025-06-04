import { HistoryService } from '@data/history.service'
import { LibrespotMetadataMapper } from '@mappers/librespotmetadata-mapper'
import { Logger } from '@nestjs/common'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { WebSocket } from 'ws'

import { MpvPlayerService } from '../mpv/mpv-player.service'

@Injectable()
export class LibrespotClientService implements OnModuleDestroy {
  private socket: WebSocket

  private readonly logger: Logger = new Logger(LibrespotClientService.name, { timestamp: true })

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly mpvPlayer: MpvPlayerService,
    private readonly historyService: HistoryService,
  ) {
    this.open('ws://127.0.0.1:3678/events')
  }

  public open(path: string) {
    this.socket = new WebSocket(path)

    this.socket.on('error', async (error) => {})

    this.socket.on('connect', () => {})

    this.socket.on('message', async (data) => {
      try {
        const json: any = JSON.parse(data.toString())
        await this.onMessage('spotify', json)
      } catch (err) {
        this.logger.error('Error processing message ' + (data ?? ''), err)
      }
    })
  }

  public onModuleDestroy() {
    this.socket.destroy()
  }

  private async onMessage(namespace: string, payload: any) {
    this.logger.verbose('Librespot event fired', payload.type)

    switch (payload.type) {
      case 'paused':
        this.eventEmitter.emit('player', { type: 'stateChanged', paused: true, source: 'spotify' })
        break
      case 'playing':
        this.eventEmitter.emit('player', { type: 'stateChanged', paused: false, source: 'spotify' })
        break
      case 'will_play':
      case 'active':
        await this.mpvPlayer.stop()
        break
      case 'metadata':
        const mapped = LibrespotMetadataMapper(payload.data)
        await this.historyService.addAnonHistory(mapped)
        await this.historyService.addLastPlayed(mapped, 'remote')
        this.eventEmitter.emit('player', { type: 'trackChanged', track: mapped, source: 'spotify' })
        break
      case 'inactive':
      case 'not_playing':
      case 'stopped':
      case 'seek':
      case 'volume':
      case 'shuffle_context':
      case 'repeat_context':
      case 'repeat_track':
        break
    }
  }
}
