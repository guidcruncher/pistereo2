import { MpvStatusMapper } from '@mappers/mpvstatus-mapper'
import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'
import * as fs from 'node:fs'
import * as path from 'node:path'

@Injectable()
export class MpvPlayerService {
  private readonly logger = new Logger(MpvPlayerService.name, { timestamp: true })

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly deviceService: MediaServerService,
  ) {}

  public async getMetaData() {
    let res = await this.deviceService.mediaServerRequest('', 'GET', `/player/status`, {})
    if (res && res.state) {
      if (res.state.metaData) {
        return res.state.metaData
      }
    }
    return {}
  }

  public async getStatus() {
    let result = await this.deviceService.mediaServerRequest('', 'GET', `/player/status`, {})
    return MpvStatusMapper(result)
  }

  public async setVolume(level: number) {
    return await this.deviceService.mediaServerRequest(
      '',
      'PUT',
      `/player/volume?volume=${level}`,
      {},
    )
  }

  public async getVolume() {
    return await this.deviceService.mediaServerRequest('', 'GET', `/player/volume`, {})
  }

  public async pause() {
    this.eventEmitter.emit('player', { type: 'paused', playing: false })
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/pause`, {})
  }

  public async resume() {
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/resume`, {})
  }

  public async stop() {
    this.eventEmitter.emit('player', { type: 'paused', playing: false })
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/stop`, {})
  }

  public async restartPlayback() {
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/resume`, {})
  }

  public async togglePlayback() {
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/toggle`, {})
  }

  public async play(req: any) {
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/play`, req)
  }
}
