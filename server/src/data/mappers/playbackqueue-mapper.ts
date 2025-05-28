import { PlayableItemMapper } from './playableitem-mapper'
import { Mapper } from './mapper'
import {
  PlaybackQueue,
  PlayableItem,
  PlayableItemList,
  PagedList,
  PagedListBuilder,
} from '../views/index'

export const PlaybackQueueMapper: Mapper<PlaybackQueue> = (value: any) => {
  let result = new PlaybackQueue()

  if (value.currently_playing) {
    result.current = PlayableItemMapper(value.currently_playing)
  }

  result.queue = [] as PlayableItem[]

  value.queue.forEach((item) => {
    result.queue.push(PlayableItemMapper(item))
  })

  return result
}
