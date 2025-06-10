import { SettingService } from '@data/setting.service'
import { HttpException, Injectable, Scope } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { History } from '@schemas/history'
import { Uri } from '@views/index'
import { PlayableItem, PlayerStatus } from '@views/index'
import * as fs from 'fs'
import * as path from 'path'

import { AuthService } from '../auth/auth.service'
import { HistoryService } from '../data/history.service'
import { MpvPlayerService } from '../mpv/mpv-player.service'
import { LibrespotPlayerService } from '../spotify/librespot-player.service'
import { TuneinPlayerService } from '../tunein/tunein-player.service'
import { UserStreamPlayerService } from '../userstream/userstream-player.service'

@Injectable({ scope: Scope.DEFAULT })
export class AudioService {
  private currentTrack: PlayableItem = {} as PlayableItem // Uri = new Uri()

  private _deviceId: string

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly mpvPlayer: MpvPlayerService,
    //    private readonly spotifyPlayer: SpotifyPlayerService,
    private readonly spotifyPlayer: LibrespotPlayerService,
    private readonly tuneinPlayer: TuneinPlayerService,
    private readonly userStreamPlayer: UserStreamPlayerService,
    private readonly authService: AuthService,
    private readonly historyService: HistoryService,
    private readonly settingService: SettingService,
  ) {}

  private async ensureDeviceId(token: string) {
    const filename = path.join(process.env.PISTEREO_CONFIG as string, 'librespot', 'state.json')

    if (fs.existsSync(filename)) {
      const obj = JSON.parse(fs.readFileSync(filename, 'utf8'))
      this._deviceId = obj.device_id
    }

    return this._deviceId
  }

  async getNowPlaying() {
    const data: any = await this.mpvPlayer.getMetaData()
    if (Object.keys(data).length > 0) {
      return data
    }
    return {}
  }

  async startLastPlayed(token: string, user: any) {
    let nothingPlaying = false
    try {
      const status = await this.getStatus(user, token)
      nothingPlaying = status.device ? !status.device.playing : false
    } catch (err) {
      nothingPlaying = true
    }

    if (nothingPlaying) {
      const lastPlayed = await this.historyService.getLastPlayed(user.id)
      if (lastPlayed) {
        await this.playMedia(user, token, lastPlayed.uri.toString())
        return true
      }
      return false
    }
  }

  async saveHistory(item: PlayableItem, token: string, user: any) {
    if (token != '') {
      await this.historyService.addLastPlayed(item, user.id)
      return await this.historyService.addHistory(item, user.id)
    }

    await this.historyService.addLastPlayed(item, '')
    return await this.historyService.addHistory(item, '')
  }

  async determineStatus(token: string, user: any) {
    let status: any = new PlayerStatus()

    try {
      status = await this.spotifyPlayer.getStatus(token)
      if (status.device.active && status.device.playing) {
        return status
      }
    } catch (err) {}
    const lastPlayed: History = await this.historyService.getLastPlayed(user.id)

    if (lastPlayed) {
      switch (lastPlayed.uri.source) {
        case 'tunein':
          status = await this.tuneinPlayer.getStatus()
          if (status.device.active && status.device.playing) {
            status.track = lastPlayed
            return status
          }
          break
        case 'user':
          status = await this.userStreamPlayer.getStatus()
          if (status.device.active && status.device.playing) {
            status.track = lastPlayed
            return status
          }
          break
      }
    }

    return status
  }

  public currentUri() {
    if (this.currentTrack) {
      if (this.currentTrack.uri) {
        return this.currentTrack.uri
      }
    }

    return ''
  }

  async playMedia(user: any, token: string, uri: string) {
    const uriParts = Uri.fromUriString(uri)
    const deviceid: string = await this.ensureDeviceId(token)
    let track: PlayableItem

    await this.mpvPlayer.stop()
    await this.spotifyPlayer.stop(token, deviceid)
    await this.historyService.clearLastPlayed()

    switch (uriParts.source) {
      case 'spotify':
        this.mpvPlayer.stop()
        track = await this.spotifyPlayer.play(token, deviceid, uriParts)
        break
      case 'tunein':
        await this.spotifyPlayer.stop(token, deviceid)
        track = await this.tuneinPlayer.play(uriParts)
        this.eventEmitter.emit('player', { type: 'trackChanged', track: track })
        break
      case 'user':
        await this.spotifyPlayer.stop(token, '')
        track = await this.userStreamPlayer.play(token, user, uriParts)
        this.eventEmitter.emit('player', { type: 'trackChanged', track: track })
        break
      default:
        throw new HttpException(`Unsupported Uri source : ${uriParts.source}`, 400)
    }

    this.currentTrack = track
    this.saveHistory(track, token, user)
    return track
  }

  async changeVolume(user: any, token, volume: number) {
    try {
      await this.spotifyPlayer.setVolume(token, await this.ensureDeviceId(token), volume)
    } catch {}

    try {
      await this.mpvPlayer.setVolume(volume)
    } catch {}

    return await this.getVolume(token)
  }

  async getStatus(user: any, token: string) {
    let status: any = new PlayerStatus()
    status = await this.determineStatus(token, user)
    status.device.volume = (await this.getVolume(token)).volume
    if (status.track) {
      this.currentTrack = status.track

      if (this.currentUri() != '') {
        return status
      }
    }

    return status
  }

  async getTrackDetail(token: string, uri: string) {
    const uriParts: Uri = Uri.fromUriString(uri)

    switch (uriParts.source) {
      case 'spotify':
        return await this.spotifyPlayer.getMetaData(token, uriParts)
      case 'tunein':
        return await this.tuneinPlayer.getStation(uriParts)
      case 'user':
        return await this.userStreamPlayer.getMetaData(uriParts)
    }

    throw new HttpException(`Unsupported Uri source ${uriParts.source}`, 400)
  }

  async getVolume(token: string) {
    try {
      return { volume: await this.mpvPlayer.getVolume() }
    } catch {
      return { volume: await this.spotifyPlayer.getVolume(token) }
    }
  }

  async togglePlayback(user: any, token: string) {
    if (this.currentUri() == '') {
      throw new HttpException('Nothing playing', 400)
    }

    switch (this.currentTrack.uri.source) {
      case 'spotify':
        const status = await this.spotifyPlayer.getStatus(token)
        if (status) {
          if (status.device.playing) {
            return await this.spotifyPlayer.playerCommand(
              token,
              await this.ensureDeviceId(token),
              'pause',
            )
          } else {
            return await this.spotifyPlayer.playerCommand(
              token,
              await this.ensureDeviceId(token),
              'play',
            )
          }
        }
        break
      case 'tunein':
      case 'user':
        return await this.mpvPlayer.togglePlayback()
        break
    }

    throw new HttpException(`Unsupported Uri source ${this.currentTrack.uri.source}`, 400)
  }

  async stopPlayback(user: any, token: string) {
    this.currentTrack = {} as PlayableItem
    await this.spotifyPlayer.playerCommand(token, await this.ensureDeviceId(token), 'stop')
    await this.historyService.clearLastPlayed()
    return await this.mpvPlayer.stop()
  }

  async nextTrack(user: any, token: string) {
    const state = await this.getStatus(user, token)

    if (state && state.track) {
      switch (state.track.uri.source) {
        case 'spotify':
          return await this.spotifyPlayer.playerCommand(
            token,
            await this.ensureDeviceId(token),
            'next',
          )
          break
        case 'tunein':
        case 'user':
          return {}
          break
      }
    }

    throw new HttpException(`Unsupported Uri source ${this.currentTrack.uri.source}`, 400)
  }

  async previousTrack(user: any, token: string) {
    if (this.currentUri() == '') {
      throw new HttpException('Nothing playing', 400)
    }

    switch (this.currentTrack.uri.source) {
      case 'spotify':
        return await this.spotifyPlayer.playerCommand(
          token,
          await this.ensureDeviceId(token),
          'previous',
        )
        break
      case 'tunein':
      case 'user':
        return {}
        break
    }

    throw new HttpException(`Unsupported Uri source ${this.currentTrack.uri.source}`, 400)
  }

  public async playFanfare(resumePreviousTrackAtEnd: boolean) {
    return await this.mpvPlayer.playFanfare(resumePreviousTrackAtEnd)
  }

  public async playFiles(filenames: string[], resumePreviousTrackAtEnd: boolean) {
    return await this.mpvPlayer.playFiles(filenames, resumePreviousTrackAtEnd)
  }
}
