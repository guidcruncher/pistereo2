import { EventBaseService } from '@core/event-base.service'
import { HttpTransportService } from '@core/http-transport.service'
import { PlayableItemMapper, PlaybackQueueMapper, SpotifyStatusMapper } from '@mappers/index'
import { HttpException, Injectable } from '@nestjs/common'
import {
  DeviceProp,
  PagedListBuilder,
  PlayableItem,
  PlaybackQueue,
  PlayerStatus,
} from '@views/index'
import { Uri } from '@views/uri'

import { LibrespotClientService } from './librespot-client.service'

Injectable()
export class SpotifyPlayerService extends EventBaseService {
  private readonly transport: HttpTransportService = new HttpTransportService()

  constructor(private readonly librespotClient: LibrespotClientService) {
    super()
  }

  private getQueryString(device_id: string, parameters?: Record<string, any>): string {
    const params = new URLSearchParams()
    params.append('device_id', device_id)

    if (parameters) {
      for (const key in parameters) {
        params.append(key, (parameters[key] ?? '').toString())
      }
    }

    return `?${params.toString()}`
  }

  async currentPlaying(token: string) {
    const trs = new HttpTransportService()
    const result = await trs.request(
      'GET',
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        Authorization: `Bearer ${token}`,
      },
    )

    const track: PlayableItem = {} as PlayableItem

    if (result.status == 204) {
      return track
    }

    return PlayableItemMapper(result.value)
  }

  async getStatus(token: string): Promise<PlayerStatus> {
    const trs = new HttpTransportService()
    const result = await trs.request('GET', 'https://api.spotify.com/v1/me/player', {
      Authorization: `Bearer ${token}`,
    })

    let state = new PlayerStatus()

    if (result.status == 204) {
      return state
    }

    state = SpotifyStatusMapper(result.value)
    return state
  }

  async getMetaData(token: string, uri: Uri) {
    if (uri.source != 'spotify') {
      throw new HttpException(`Bad uri source, got ${uri.source}, expected spotify`, 400)
    }

    let url = ''
    5
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
    if (uri.type == 'playlist') {
      return PlayableItemMapper(result.value.tracks.items[0].track)
    }

    return PlayableItemMapper(result.value)
  }

  async play(token: string, device_id: string, uri: Uri): Promise<PlayableItem> {
    if (uri.source != 'spotify') {
      throw new HttpException(`Bad uri source, got ${uri.source}, expected spotify`, 400)
    }

    let request: any = {} as any
    switch (uri.type) {
      case 'album':
      case 'playlist':
      case 'artist':
      case 'show':
        request = { context_uri: uri.toString(), position_ms: 0 }
        break
      case 'track':
      case 'episode':
        request = { uris: [uri.toString()], position_ms: 0 }
        break
    }

    const result = await this.transport.request(
      'PUT',
      'https://api.spotify.com/v1/me/player/play' + this.getQueryString(device_id),
      { Authorization: `Bearer ${token}` },
      request,
    )

    if (result.status == 204) {
      const status = await this.getMetaData(token, uri)
      if (status) {
        return status
      }
    }

    throw new HttpException('Playback error', result.status)
  }

  async stop(token: string, device_id: string) {
    try {
      return await this.transport.request(
        'PUT',
        'https://api.spotify.com/v1/me/player/pause' + this.getQueryString(device_id),
        { Authorization: `Bearer ${token}` },
        {},
      )
    } catch (err) {
      return {}
    }
  }

  async playerCommand(token: string, device_id: string, command: string): Promise<PlayableItem> {
    let result: any = undefined

    switch (command) {
      case 'play':
      case 'resume':
        result = await this.transport.request(
          'PUT',
          'https://api.spotify.com/v1/me/player/play' + this.getQueryString(device_id),
          { Authorization: `Bearer ${token}` },
          {},
        )
        break
      case 'previous':
        result = await this.transport.request(
          'POST',
          'https://api.spotify.com/v1/me/player/previous' + this.getQueryString(device_id),
          { Authorization: `Bearer ${token}` },
          {},
        )
        break
      case 'next':
        result = await this.transport.request(
          'POST',
          'https://api.spotify.com/v1/me/player/next' + this.getQueryString(device_id),
          { Authorization: `Bearer ${token}` },
          {},
        )
        break
      case 'stop':
      case 'pause':
        result = await this.stop(token, device_id)
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
    const status = await this.getStatus(token)
    if (status) {
      if (status.device) {
        return status.device.volume
      }
    }

    return 0
  }

  async setVolume(token: string, device_id: string, value: number) {
    const result = await this.transport.request(
      'PUT',
      'https://api.spotify.com/v1/me/player/volume' +
        this.getQueryString(device_id, { volume_percent: value }),
      { Authorization: `Bearer ${token}` },
      {},
    )

    return result
  }

  async getPlaybackQueue(token: string): Promise<PlaybackQueue> {
    const result = await this.transport.request(
      'GET',
      'https://api.spotify.com/v1/me/player/queue',
      { Authorization: `Bearer ${token}` },
    )

    return PlaybackQueueMapper(result.value)
  }

  async addToQueue(token: string, uri: Uri) {
    const result = await this.transport.request(
      'POST',
      'http://127.0.0.1:3678/player/add_to_queue',
      { 'Content-Type': 'application/json' },
      { uri: uri.toString() },
    )
    return result
  }

  async getDevices(token: string): Promise<DeviceProp[]> {
    const result = await this.transport.request(
      'GET',
      'https://api.spotify.com/v1/me/player/devices',
      { Authorization: `Bearer ${token}` },
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

  async disconnect(token: string, deviceid: string) {
    return await this.playerCommand(token, deviceid, 'stop')
  }

  async connect(token: string, name: string): Promise<DeviceProp> {
    const device = await this.getDeviceId(token, name)

    const result = await this.transport.request(
      'PUT',
      'https://api.spotify.com/v1/me/player',
      { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      { device_ids: [device.id], play: true },
    )

    this.emit('streamer.disconnect', {})
    return device
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
