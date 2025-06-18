import { Logger, OnModuleInit, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Socket, io } from 'socket.io-client'
import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'
import { WebSocket } from 'ws'
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(WebsocketService.name, {
    timestamp: true,
  })

  private socket: WebSocket
  private connected: boolean = false

  constructor(
    private readonly deviceService: MediaServerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async initialise(address: string = '') {
    let device = await this.deviceService.getActive()
    let ipa = address

    if (ipa == '') {
      if (!device || device.length <= 0) {
        return
      }
      ipa = device[0].ipAddress
    }

    let path = 'ws://' + ipa + ':4678/'
    this.socket = new WebSocket(path)

    this.socket.on('error', async (error) => {
      this.logger.error('MediaServer Websocket error', error)
    })

    this.socket.on('connect', () => {
      this.connected = true
      this.logger.debug('MediaServer Websocket connected')
    })

    this.socket.on('message', async (raw) => {
      try {
        let data = Buffer.from(raw).toString('utf8')
        const json: any = JSON.parse(data.toString())
        await this.onMessage(json)
      } catch (err) {
        let d = Buffer.from(raw).toString('utf8')
        this.logger.error('Error parsing MediaServer message ' + d, err)
      }
    })
  }

  onApplicationBootstrap() {
    this.initialise()
  }

  @OnEvent('ensuresocket')
  async ensuresocket(payload: any) {
    this.logger.debug('Ensuring MediaServer connection ', payload.device)

    if (!this.connected) {
      this.logger.debug('MediaServer Socket connecting to ' + payload.device.ipAddress)
      this.initialise(payload.device.ipAddress)
    }
  }

  private async onMessage(payload: any) {
    this.logger.debug('MediaServer event', JSON.stringify(payload))
    this.eventEmitter.emit(payload.event, payload.payload)
  }
}
