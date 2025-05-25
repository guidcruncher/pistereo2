import { Logger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import * as util from 'util'
import * as path from 'path'
import { MpvStatusMapper } from '@mappers/mpvstatus-mapper'

const execFile = util.promisify(require('node:child_process').execFile)

const errorCodes: Record<string, number> = {
  success: 200,
  'property not found': 404,
  'property unavailable': 400,
}

@Injectable()
export class MpvPlayerService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async getMetaData() {
    const idleProp = await this.sendCommand('get_property', ['core-idle'])

    if (idleProp && idleProp.statusCode == 200 && !idleProp.data) {
      const metaData = await this.sendCommand('get_property', ['metadata'])
      if (metaData && metaData.statusCode == 200 && metaData.data) {
        return metaData.data
      }
    }

    return {}
  }

  private async sendCommand(cmd: string, parameters: any[] = []): Promise<any> {
    let commandText: any[] = [cmd]
    commandText = commandText.concat(parameters)
    const jsonCmd: string = JSON.stringify({ command: commandText })
    const socket: string =
      (process.env.PISTEREO_MPV_SOCKET as string) ??
      path.join(process.cwd(), '../pistereo-config/mpv/socket')
    const cmdArgs: string[] = ['-c', `echo '${jsonCmd}' | socat - ${socket}`]

    return new Promise((resolve, reject) => {
      try {
        if (cmd == 'get_property' && parameters.length > 0) {
          if (parameters[0] == '') {
            reject()
            return
          }
        }

        execFile('sh', cmdArgs)
          .then((result) => {
            try {
              const json: any = JSON.parse(result.stdout)
              if (json.error) {
                json.statusCode = errorCodes[json.error] ?? 500
                json.command = jsonCmd
                resolve(json)
              } else {
                resolve(json)
              }
            } catch (err) {
              resolve({
                statusCode: 500,
                command: jsonCmd,
              })
            }
          })
          .catch((err) => {
            resolve({ statusCode: 500, command: jsonCmd })
            //reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  public async getStatus() {
    const result: any = {
      playing: false,
      active: false,
      url: '',
      volume: 0,
      position: 0.0,
    }
    const pathProp = await this.sendCommand('get_property', ['path'])
    const volProp = await this.sendCommand('get_property', ['volume'])
    const metaData = await this.sendCommand('get_property', ['metadata'])
    const playbackProp = await this.sendCommand('get_property', ['playback-time'])
    const idleProp = await this.sendCommand('get_property', ['core-idle'])

    if (playbackProp && playbackProp.statusCode == 200) {
      result.position = playbackProp.data
    }

    if (metaData && metaData.statusCode == 200) {
      result.metadata = metaData.data
    }
    if (idleProp && idleProp.statusCode == 200) {
      result.playing = !idleProp.data
    }

    if (pathProp && pathProp.statusCode == 200) {
      result.active = true
      result.url = pathProp.data
    }
    if (volProp && volProp.statusCode == 200) {
      result.volume = volProp.data
    }

    return MpvStatusMapper(result)
  }

  public async setVolume(level: number) {
    return await this.sendCommand('set_property', ['volume', `${level}`])
  }

  public async getVolume() {
    const volProp = await this.sendCommand('get_property', ['volume'])
    if (volProp && volProp.statusCode == 200) {
      return volProp.data
    }
    return 0
  }

  public async stop() {
    this.eventEmitter.emit('player', { type: 'paused', playing: false })
    return await this.sendCommand('stop', [])
  }

  public async togglePlayback() {
    await this.sendCommand('cycle', ['pause'])
    let prop = await this.sendCommand('get_property', ['pause'])
    if (!prop) {
      return false
    }
    let playing = !prop.data
    if (!playing) {
      this.eventEmitter.emit('player', { type: 'paused', playing: false })
    } else {
      this.eventEmitter.emit('player', { type: 'playing', playing: true })
    }

    return !prop.data
  }

  public async play(url: string) {
    const state: any = await this.getStatus()
    return await this.sendCommand('loadfile', [url, 'replace'])
  }
}
