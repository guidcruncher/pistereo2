import { EventBaseService } from '@core/event-base.service'
import { HttpTransportService } from '@core/http-transport.service'
import { LibrespotStatusMapper, PlayableItemMapper, PlaybackQueueMapper } from '@mappers/index'
import { Logger, HttpException, Injectable } from '@nestjs/common'
import {
  DeviceProp,
  PagedListBuilder,
  PlayableItem,
  PlaybackQueue,
  PlayerStatus,
} from '@views/index'
import { Uri } from '@views/uri'

import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'

@Injectable()
export class LibrespotPlayerService extends EventBaseService {
  private readonly transport: HttpTransportService = new HttpTransportService()

  private readonly logger: Logger = new Logger(LibrespotPlayerService.name, {
    timestamp: true,
  })

  constructor(private readonly deviceService: MediaServerService) {
    super()
  }

  async getStatus(token: string): Promise<PlayerStatus> {
    const result = await this.deviceService.mediaServerRequest(token, 'GET', `/player/status`, {})
    return result
  }

  async getMetaData(token: string, uri: Uri) {
    if (uri.source != 'spotify') {
      throw new HttpException(`Bad uri source, got ${uri.source}, expected spotify`, 400)
    }

    let url = ''

    switch (uri.type) {
      case 'album':
        url = 'https://api.spotify.com/v1/albums/' + uri.id
        break
      case 'playlist':
        url = 'https://api.spotify.com/v1/playlists/' + uri.id
        break
      case 'artist':
        url = 'https://api.spotify.com/v1/artists/' + uri.id
        break
      case 'show':
        url = 'https://api.spotify.com/v1/shows/' + uri.id
        break
      case 'track':
        url = 'https://api.spotify.com/v1/tracks/' + uri.id
        break
      case 'episode':
        url = 'https://api.spotify.com/v1/episodes/' + uri.id
        break
    }

    const result = await this.transport.request('GET', url, { Authorization: `Bearer ${token}` })
    let mapped: any = {}

    if (uri.type == 'playlist') {
      mapped = PlayableItemMapper(result.value.tracks.items[0].track)
      mapped.uri = uri
    } else {
      mapped = PlayableItemMapper(result.value)
    }

    return mapped
  }

  async play(token: string, device_id: string, uri: Uri): Promise<PlayableItem> {
    let req = await this.getMetaData(token, uri)
    let res = await this.deviceService.mediaServerRequest(token, 'PUT', `/player/play`, req)
    let state = await this.getStatus(token)
    return req
  }

  async stop(token: string, device_id: string) {
    return await this.deviceService.mediaServerRequest(token, 'PUT', `/player/stop`, {})
  }

  async pause() {
    return await this.deviceService.mediaServerRequest('', 'PUT', `/player/stop`, {})
  }

  private async getNextTrackUri(token: string) {
    const currentQueue: PlaybackQueue = await this.getPlaybackQueue(token)
    if (currentQueue && currentQueue.queue.length > 0) {
      const uri: Uri = currentQueue.queue[0].uri
      return uri.toString()
    }

    return ''
  }

  async playerCommand(token: string, device_id: string, command: string): Promise<PlayableItem> {
    let result: any = undefined

    switch (command) {
      case 'play':
      case 'resume':
        result = await this.deviceService.mediaServerRequest(token, 'PUT', `/player/resume`, {})
        break
      case 'previous':
        result = await this.deviceService.mediaServerRequest(token, 'PUT', `/player/previous`, {})
        break
      case 'next':
        result = await this.deviceService.mediaServerRequest(token, 'PUT', `/player/next`, {
          uri: await this.getNextTrackUri(token),
        })
        break
      case 'stop':
        result = await this.deviceService.mediaServerRequest(token, 'PUT', `/player/stop`, {})
        break
      case 'pause':
        result = await this.deviceService.mediaServerRequest(token, 'PUT', `/player/pause`, {})
        break
    }

    if (result) {
      const status = await this.getStatus(token)
      if (status) {
        return status.track
      }
    }

    throw new HttpException('Invalid Player command', 400)
  }

  async getVolume(token: string) {
    let state = await this.getStatus(token)
    if (state) {
      return state.device.volume
    }
    return 0
  }

  async setVolume(token: string, device_id: string, value: number) {
    return await this.deviceService.mediaServerRequest(
      token,
      'PUT',
      `/player/volume?volume=${value}`,
      {},
    )
  }

  async getPlaybackQueue(token: string): Promise<PlaybackQueue> {
    const result = await this.transport.request(
      'GET',
      'https://api.spotify.com/v1/me/player/queue',
      {
        Authorization: `Bearer ${token}`,
      },
    )

    return PlaybackQueueMapper(result.value)
  }

  async getDevices(token: string): Promise<DeviceProp[]> {
    const result = await this.transport.request(
      'GET',
      'https://api.spotify.com/v1/me/player/devices',
      {
        Authorization: `Bearer ${token}`,
      },
    )
    return result.value.devices
      .map((a) => {
        return { id: a.id, name: a.name, active: a.is_active } as DeviceProp
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
  }

  async getDeviceId(token: string, name: string): Promise<DeviceProp> {
    const result = await this.getDevices(token)

    if (result) {
      const device = result.find((device) => {
        return device.name == name
      })

      if (device) {
        return device
      }

      throw new HttpException(`Device not found ${name}`, 404)
    }

    throw new HttpException(`No Devices found ${name}`, 404)
  }

  async search(token: string, user: any, type: string, q: string, offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('q', q)
    params.append('market', user.country)
    params.append('type', type.toLowerCase())
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())

    const result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/search?${params.toString()}`,
      { Authorization: `Bearer ${token}` },
    )

    const key = type.toLowerCase() + 's'

    if (!result.value[key]) {
      throw new HttpException(`Property "${key}" missing on results`, 500)
    }

    return PagedListBuilder.fromPagedObject<PlayableItem>(result.value[key], PlayableItemMapper)
  }
}
