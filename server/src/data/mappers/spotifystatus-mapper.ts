import { Context, PlayerStatus, Uri } from '../views/index'
import { imageUrl, Mapper } from './mapper'

export const SpotifyStatusMapper: Mapper<PlayerStatus> = (value: any) => {
  const result = new PlayerStatus()

  if (!value) {
    return result
  }

  result.source = value.source

  if (value.device) {
    result.device.id = value.device.id ?? ''
    result.device.name = value.device.name ?? ''
    result.device.volume = value.device.volume_percent ?? 0
    result.device.active = value.device.is_active
  }

  result.device.playing = value.is_playing
  result.device.progress_ms = value.progress_ms ?? 0

  if (value.context) {
    result.track.context = new Context()
    result.track.context.type = value.context.type
    result.track.context.uri = value.context.uri
  }

  if (value.item) {
    switch (value.currently_playing_type) {
      case 'track':
        result.track.uri = Uri.fromUriString(value.item.uri)
        result.track.name = value.item.name
        result.track.artists = value.item.artists.map((a) => a.name)
        result.track.imageUrl = ''
        result.track.imageUrl = imageUrl(value.item.album.images)
        result.track.owner = value.item.album.name
        break
      case 'episode':
        result.track.owner = value.item.show.name
        result.track.uri = Uri.fromUriString(value.item.uri)
        result.track.name = value.item.name
        result.track.artists = [value.item.show.publisher]
        result.track.imageUrl = imageUrl(value.item.show.images)
        if (value.item.images) {
          result.track.imageUrl = imageUrl(value.item.images)
        }
        break
    }
  }
  return result
}
