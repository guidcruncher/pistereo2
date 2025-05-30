import { PlayableItemMapper } from './playableitem-mapper'
import { Mapper } from './mapper'
import {
  PagedList,
  PagedListBuilder,
  PlayableItem,
  PlayableItemList,
  PlaybackQueue,
} from '../views/index'

export const PlaybackQueueMapper: Mapper<PlaybackQueue> = (value: any) => {
  const result = new PlaybackQueue()

  if (value.currently_playing) {
    result.current = PlayableItemMapper(value.currently_playing)
  }

  result.queue = [] as PlayableItem[]

  value.queue.forEach((item) => {
    result.queue.push(PlayableItemMapper(item))
  })

  return result
}
