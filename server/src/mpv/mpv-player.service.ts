import { MpvStatusMapper } from '@mappers/mpvstatus-mapper'
import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class MpvPlayerService {
  private readonly logger = new Logger(MpvPlayerService.name, { timestamp: true })

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly deviceService: MediaServerService,
  ) {}

  public async getMetaData() {
    let res = await this.deviceService.mediaServerGet('GET', `/player/status`, {})
    if ((res) && (res.state)) {
      if (res.state.metaData) {
        return res.state.metaData
      }
    }
    return {}
  }

  public async getStatus() {
    let result = await this.deviceService.mediaServerGet('GET', `/player/status`, {})
    return MpvStatusMapper(result)
  }

  public async setVolume(level: number) {
    return await this.deviceService.mediaServerOp('PUT', `/player/volume?volume=${level}`, {})
  }

  public async getVolume() {
    return await this.deviceService.mediaServerGet('GET', `/player/volume`, {})
  }

  public async stop() {
    this.eventEmitter.emit('player', { type: 'paused', playing: false })
    return await this.deviceService.mediaServerGet('PUT', `/player/stop`, {})
  }

  public async restartPlayback() {
    return await this.deviceService.mediaServerGet('PUT', `/player/resume`, {})
  }

  public async togglePlayback() {
    return await this.deviceService.mediaServerGet('PUT', `/player/toggle`, {})
  }

  public async play(url: string) {
    return await this.deviceService.mediaServerGet('PUT', `/player/play`, { url: url })
  }

  public async playFiles(files: string[], resumePreviousTrackAtEnd: boolean) {
    const urls: string[] = files
    return await this.playlist(urls, resumePreviousTrackAtEnd)
  }

  public async playlist(urls: string[], resumePreviousTrackAtEnd: boolean) {
    const playListFile = path.join(process.env.PISTEREO_CACHE as string, 'temp.m3u')

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

    if (fs.existsSync(playListFile)) {
      fs.unlinkSync(playListFile)
    }
    fs.writeFileSync(playListFile, m3u.join('\n'), 'utf8')

    await this.play(playListFile)
    await this.restartPlayback()
  }
}
