import { imageUrl, Mapper } from './mapper'
import { Uri, Album, Context, Track, Device, PlayerStatus } from '../views/index'

export const MpvStatusMapper: Mapper<PlayerStatus> = (value: any) => {
  let result = new PlayerStatus()

  if (!value) {
    return result
  }

  result.source = 'mpv'

  result.device.id = 'mpv'
  result.device.name = 'mpv'
  result.device.volume = value.volume ?? 0
  result.device.active = value.active
  result.device.playing = value.playing
  result.device.progress_ms = value.position ?? 0
  result.track.url = value.url
  return result
}
