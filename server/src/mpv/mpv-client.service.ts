import * as path from 'path'
import * as net from 'net'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Logger } from '@nestjs/common'
import { MpvPlayerService } from './mpv-player.service'

@Injectable()
export class MpvClientService {
  private socket: net.Socket
  private readonly logger: Logger = new Logger(MpvClientService.name, { timestamp: true })

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly mpvPlayer: MpvPlayerService,
  ) {
    this.open()
  }

  private open() {
    let address: string =
      (process.env.PISTEREO_MPV_SOCKET as string) ??
      path.join(process.cwd(), '../pistereo-config/mpv/socket')

    this.socket = new net.Socket()
    this.socket.setEncoding('utf-8')

    this.socket.on('error', (error) => {
      log.error('Error in Streamer socket', error)
    })

    this.socket.on('close', (state) => {
      log.warn('Streamer socket closed', state)
    })

    this.socket.on('data', (data) => {
      let json: any
      try {
        json = JSON.parse(data.toString())
      } catch (err) {
        this.log.error('Malformed MPV event ', data.toString())
        json = {}
      }

      if (json.event) {
        switch (json.event) {
          case 'metadata-update':
            let data: any = await this.mpvPlayer.getMetaData()
            if (Object.keys(data).length > 0) {
              this.eventEmitter.emit('player', { type: 'metadata-update', data: data })
            }
            break
          default:
            this.log.verbose(`Skipping emitting MPV event ${json.event}`)
        }
      }
    })

    this.socket.connect({ path: address }, () => {
      log.debug('Socket connection to MPV open')
    })
  }
}
