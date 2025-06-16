import { OnModuleInit, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Socket, io } from 'socket.io-client'
import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'
import { WebSocket } from 'ws'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
  private socket: WebSocket
  private connected: boolean = false

  constructor(
    private readonly deviceService: MediaServerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async initialise(address: string = '') {
    let device = await this.deviceService.getActive()
    let ipa = address

    if (!device || device.length <= 0) {
      return
    }

    if (address == '') { ipa = device[0].ipAddress} 
    let path = 'ws://' + ipa + ':4678/'
    this.socket = new WebSocket(path)

    this.socket.on('error', async (error) => {})

    this.socket.on('connect', () => { this.connected = true})

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

  @OnEvent('ensuresocket')
  async ensuresocket(payload: any) {
   console.log("Ensuring connection ", payload.device)

    if (!this.connected) {
    this.initialise(payload.device.ipAddress)
    }
  }

  private async onMessage(payload: any) {
    this.eventEmitter.emit('player', {
      type: 'stateChanged',
      paused: true,
      source: 'spotify',
    })
  }
}
