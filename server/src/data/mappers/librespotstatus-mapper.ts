import { imageUrl, Mapper } from './mapper'
import { Uri, Album, Context, PlayableItem, Track, Device, PlayerStatus } from '../views/index'

export const LibrespotStatusMapper: Mapper<PlayerStatus> = (value: any) => {
  let result = new PlayerStatus()

  if (!value) {
    return result
  }

  result.source = value.source

  result.device.id = value.device_id ?? ''
  result.device.name = value.device_name ?? ''
  result.device.volume = value.volume ?? 0
  result.device.active = !value.stopped
  result.source = 'spotify'

  result.device.playing = !value.stopped && !value.paused
  result.device.progress_ms = 0

  if (value.track) {
    result.track = {} as PlayableItem
    result.track.uri = Uri.fromUriString(value.track.uri)
    result.track.name = value.track.name
    result.track.artists = value.track.artist_names
    result.track.owner = value.track.album_name
    result.track.imageUrl = value.track.album_cover_url
  }

  return result
}
