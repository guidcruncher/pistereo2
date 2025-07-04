import { BaseService } from './base.service'
import axios, { type AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user'
import { usePlayerStore } from '@/stores/player'
import { type PlayableItem, CreatePlayableItem } from '@/dto/playableitem'
import { Uri } from '@/dto/uri'

export class PlayerService extends BaseService {
  constructor() {
    super('/api')
  }

  async speak(lang: string, text: string) {
    const response: AxiosResponse<any> = await this.client().post(`/tts/${lang}`, { text: text })
    return response.data
  }

  async playLocalFile(filename: string) {
    const params = new URLSearchParams()
    params.append('file', filename)
    const response: AxiosResponse<any> = await this.client().put(`/playfile?${params.toString()}`)
    return response.data
  }

  async getStatus() {
    const response: AxiosResponse<any> = await this.client().get('/status')
    return response.data
  }

  async getPresets() {
    const response: AxiosResponse<any> = await this.client().get('/presets')
    return response.data
  }

  async listQueue(offset: number, limit: number) {
    const response: AxiosResponse<any> = await this.client().get('/queue')
    return response.data
  }

  async getTrackDetail(uri: Uri) {
    const params = new URLSearchParams()
    params.append('uri', this.uriString(uri))
    params.append('push', 'true')
    const response: AxiosResponse<any> = await this.client().get(
      `/metadata/track?${params.toString()}`,
    )
    return response.data
  }

  async getNowPlayingStream() {
    const response: AxiosResponse<any> = await this.client().get(`/stream/metadata`)
    return response.data
  }

  async addPreset(uri: Uri) {
    const params = new URLSearchParams()
    params.append('uri', this.uriString(uri))
    const response: AxiosResponse<any> = await this.client().put(`/presets?${params.toString()}`)
    return response.data
  }

  async tryStartLastPlayed() {
    const response: AxiosResponse<any> = await this.client().put(`/lastplayed`)
    return response.data
  }

  private uriString(uri: any) {
    const res = `${uri.source}:${uri.type}:${uri.id}`
    return res
  }

  async getNowPlaying() {
    const response: AxiosResponse<any> = await this.client().get(`/nowplaying`)
    return response.data
  }

  async getMixer(device: string) {
    const response: AxiosResponse<any> = await this.client().get(`/mixer/${device}`)
    return response.data
  }

  async restoreSettings(device: string) {
    const response: AxiosResponse<any> = await this.client().get(`/restore/${device}`)
    return response.data
  }

  async updateMixer(device: string, settings: any) {
    const response: AxiosResponse<any> = await this.client().post(`/mixer/${device}`, settings)
    return response.data
  }

  async updateMixerChannel(device: string, item: any, index: number) {
    const response: AxiosResponse<any> = await this.client().post(
      `/mixer/${device}/channel/${index}`,
      item,
    )
    return response.data
  }

  async play(uri: any) {
    const params = new URLSearchParams()
    params.append('uri', this.uriString(uri))
    const response: AxiosResponse<any> = await this.client().put(`/play?${params.toString()}`)
    return response.data
  }

  async getMetaData(uri: Uri) {
    const params = new URLSearchParams()
    params.append('uri', this.uriString(uri))
    const response: AxiosResponse<any> = await this.client().get(
      `/metadata/track?${params.toString()}`,
    )
    return CreatePlayableItem(response.data)
  }

  async setVolume(volume: number) {
    const params = new URLSearchParams()
    params.append('volume', volume.toString())
    const response: AxiosResponse<any> = await this.client().put(`/volume?${params.toString()}`)
    return response.data
  }

  async togglePlayback() {
    const response: AxiosResponse<any> = await this.client().put('/toggleplayback')
    return response.data
  }

  async pause() {
    const response: AxiosResponse<any> = await this.client().put('/pause')
    return response.data
  }

  async resume() {
    const response: AxiosResponse<any> = await this.client().put('/resume')
    return response.data
  }

  async next() {
    const response: AxiosResponse<any> = await this.client().put('/next')
    return response.data
  }

  async previous() {
    const response: AxiosResponse<any> = await this.client().put('/previous')
    return response.data
  }

  async stop() {
    const response: AxiosResponse<any> = await this.client().put('/stop')
    return response.data
  }

  async listMyPlaylists(offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/list/spotify/playlists?${params.toString()}`,
    )

    return response.data
  }

  async listSavedAlbums(offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/list/spotify/albums?${params.toString()}`,
    )

    return response.data
  }

  async listSavedEpisodes(offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/list/spotify/episodes?${params.toString()}`,
    )

    return response.data
  }

  async listSavedShows(offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/list/spotify/shows?${params.toString()}`,
    )

    return response.data
  }

  async listShowEpisodes(uri: Uri, offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('uri', uri.uri)
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/list/spotify/show/episodes?${params.toString()}`,
    )

    return response.data
  }

  async listSavedTracks(offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/list/spotify/tracks?${params.toString()}`,
    )

    return response.data
  }

  async search(type: string, query: string, offset: number, limit: number) {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())
    const response: AxiosResponse<any> = await this.client().get(
      `/search/${type.toLowerCase()}?${params.toString()}`,
    )

    return response.data
  }

  async getUserSettings() {
    const response: AxiosResponse<any> = await this.client().get(`/user/settings`)

    return response.data
  }

  async saveUserSetting(key: string, value: any) {
    const params = new URLSearchParams()
    params.append('value', value.toString())
    const response: AxiosResponse<any> = await this.client().put(
      `/user/setting/${key}?${params.toString()}`,
    )

    return response.data
  }
}
