import { OnModuleInit, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Socket, io } from 'socket.io-client'
import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'
import { WebSocket } from 'ws'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
  private socket: WebSocket

  constructor(
    private readonly deviceService: MediaServerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async initialise() {
    let device = await this.deviceService.getActive()

    if (!device || device.length <= 0) {
      return
    }
    let path = 'ws://' + device[0].ipAddress + ':4678/'
    this.socket = new WebSocket(path)

    this.socket.on('error', async (error) => {})

    this.socket.on('connect', () => {})

    this.socket.on('message', async (data) => {
      try {
        console.log('PAYLOAD', data)
        const json: any = JSON.parse(data.toString())
        await this.onMessage(json)
      } catch (err) {}
    })
  }

  onApplicationBootstrap() {
    this.initialise()
  }

  private async onMessage(payload: any) {
    this.eventEmitter.emit('player', {
      type: 'stateChanged',
      paused: true,
      source: 'spotify',
    })
  }
}
