import { PlayerStatus } from '../views/index'
import { Mapper } from './mapper'

export const MpvStatusMapper: Mapper<PlayerStatus> = (value: any) => {
  const result = new PlayerStatus()

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
