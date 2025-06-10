import { MpvStatusMapper } from '@mappers/mpvstatus-mapper'
import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const execFile = util.promisify(require('node:child_process').execFile)

const errorCodes: Record<string, number> = {
  success: 200,
  'property not found': 404,
  'property unavailable': 400,
}

@Injectable()
export class MpvPlayerService {
  private readonly logger = new Logger(MpvPlayerService.name, { timestamp: true })

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async isPlaylist() {
    const playlistCount = await this.sendCommand('get_property', ['playlist-count'])
    return parseInt(playlistCount.data) > 1
  }

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

        this.logger.verbose(`sendCommand: ${cmdArgs.join(' ')}`)

        execFile('sh', cmdArgs)
          .then((result) => {
            try {
              const json: any = JSON.parse(result.stdout)
              if (json.error) {
                if (json.error != 'success') {
                  this.logger.warn('sendCommand Error ', json)
                  json.statusCode = errorCodes[json.error] ?? 500
                  json.command = jsonCmd
                  resolve(json)
                } else {
                  json.statusCode = errorCodes[json.error] ?? 500
                  json.command = jsonCmd
                  resolve(json)
                }
              } else {
                resolve(json)
              }
            } catch (err) {
              this.logger.warn('sendCommand Error ', err)
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

  public async restartPlayback() {
    const prop = await this.sendCommand('set_property', ['pause', false])
    if (!prop) {
      return false
    }
    const playing = !prop.data
    if (!playing) {
      this.eventEmitter.emit('player', { type: 'paused', playing: false })
    } else {
      this.eventEmitter.emit('player', { type: 'playing', playing: true })
    }
    return !prop.data
  }

  public async togglePlayback() {
    await this.sendCommand('cycle', ['pause'])
    const prop = await this.sendCommand('get_property', ['pause'])
    if (!prop) {
      return false
    }
    const playing = !prop.data
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

  private async getCurrentPlayingUrl() {
    const idleProp = await this.sendCommand('get_property', ['core-idle'])

    if (idleProp && idleProp.statusCode == 200) {
      if (!idleProp.data) {
        const pathProp = await this.sendCommand('get_property', ['path'])
        if (pathProp && pathProp.statusCode == 200) {
          return pathProp.data
        }
      }
    }

    return ''
  }

  public async playFanfare(resumePreviousTrackAtEnd: boolean) {
    return await this.playFiles(['FranzSchubert-DieForelle.mp3'], resumePreviousTrackAtEnd)
  }

  public async playFiles(files: string[], resumePreviousTrackAtEnd: boolean) {
    const urls: string[] = files
    return await this.playlist(urls, resumePreviousTrackAtEnd)
  }

  public async playlist(urls: string[], resumePreviousTrackAtEnd: boolean) {
    const playListFile = path.join(process.env.PISTEREO_CACHE as string, 'temp.m3u')
    const currentPlayingUrl = await this.getCurrentPlayingUrl()

    if (fs.existsSync(playListFile)) {
      fs.unlinkSync(playListFile)
    }

    const m3u: string[] = [] as string[]
    m3u.push('#EXTM3U')
    urls.forEach((url) => {
      if (url.startsWith('http://') || url.startsWith('https://')) m3u.push(url)
      else {
        m3u.push(path.join('/streams/', url))
      }
    })

    if (resumePreviousTrackAtEnd && currentPlayingUrl != '') {
      m3u.push(currentPlayingUrl)
    }

    if (fs.existsSync(playListFile)) {
      fs.unlinkSync(playListFile)
    }
    fs.writeFileSync(playListFile, m3u.join('\n'), 'utf8')

    await this.play(playListFile)
    await this.restartPlayback()
  }
}
