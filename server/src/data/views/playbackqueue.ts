import { PlayableItem } from './playableitem'

import { PagedList } from './index'

export class PlaybackQueue {
  current: PlayableItem
  queue: PlayableItem[] = [] as PlayableItem[]

  constructor() {
    this.current = {} as PlayableItem
  }
}
