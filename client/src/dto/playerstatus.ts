import { Device } from './device'
import { Track } from './track'
import { type PlayableItem } from './playableitem'

export class PlayerStatus {
  device: Device = new Device()
  track: PlayableItem = {} as PlayableItem
  source: string = ''
}
