import { PlayableItem } from './playableitem'

export class PlaybackQueue {
  current: PlayableItem

  queue: PlayableItem[] = [] as PlayableItem[]

  constructor() {
    this.current = {} as PlayableItem
  }
}
