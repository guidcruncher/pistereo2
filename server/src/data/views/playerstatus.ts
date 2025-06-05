import { Device } from './device'
import { PlayableItem } from './playableitem'

export class PlayerStatus {
  device: Device = new Device()

  track: PlayableItem = {} as PlayableItem

  source = ''
}
