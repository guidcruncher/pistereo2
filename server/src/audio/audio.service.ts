import { Logger } from 'nestjs-pino'
import { Uri } from '@views/index'
import { HttpException, Injectable, Scope } from '@nestjs/common'
import { MpvPlayerService } from '../mpv/mpv-player.service'
import { SpotifyPlayerService } from '../spotify/spotify-player.service'
import { LibrespotPlayerService } from '../spotify/librespot-player.service'
import { TuneinPlayerService } from '../tunein/tunein-player.service'
import { UserStreamPlayerService } from '../userstream/userstream-player.service'
import { AuthService } from '../auth/auth.service'
import { HistoryService } from '../data/history.service'
import { PlayerStatus, PlayableItem, DeviceProp } from '@views/index'
import { History } from '@schemas/history'
import { OnEvent, EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import * as fs from 'fs'
import * as path from 'path'

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
  ) {}

  private async ensureDeviceId(token: string) {
    let filename = path.join(process.env.PISTEREO_CONFIG as string, 'librespot', 'state.json')

    if (fs.existsSync(filename)) {
      let obj = JSON.parse(fs.readFileSync(filename, 'utf8'))
      this._deviceId = obj.device_id
    }

    return this._deviceId
  }

  async startLastPlayed(token: string, user: any) {
    let nothingPlaying = false
    try {
      let status = await this.getStatus(user, token)
      nothingPlaying = status.device ? !status.device.playing : false
    } catch (err) {
      nothingPlaying = true
    }

    if (nothingPlaying) {
      let lastPlayed = await this.historyService.getLastPlayed(user.id)
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
    let lastPlayed: History = await this.historyService.getLastPlayed(user.id)

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
    let uriParts = Uri.fromUriString(uri)
    let deviceid: string = await this.ensureDeviceId(token)
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
    await this.spotifyPlayer.setVolume(token, await this.ensureDeviceId(token), volume)
    await this.mpvPlayer.setVolume(volume)
    return await this.getVolume(token)
  }

  async getStatus(user: any, token: string) {
    let status: any = new PlayerStatus()
    status = await this.determineStatus(token, user)
    if (status.track) {
      this.currentTrack = status.track

      if (this.currentUri() != '') {
        return status
      }
    }

    return status
  }

  async getTrackDetail(token: string, uri: string) {
    let uriParts: Uri = Uri.fromUriString(uri)

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
    return { volume: await this.mpvPlayer.getVolume() }
  }

  async togglePlayback(user: any, token: string) {
    if (this.currentUri() == '') {
      throw new HttpException('Nothing playing', 400)
    }

    switch (this.currentTrack.uri.source) {
      case 'spotify':
        let status = await this.spotifyPlayer.getStatus(token)
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
    if (this.currentUri() == '') {
      throw new HttpException('Nothing playing', 400)
    }

    switch (this.currentTrack.uri.source) {
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
}
