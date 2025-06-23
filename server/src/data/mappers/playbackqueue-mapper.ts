import { PlayableItem, PlaybackQueue } from '../views/index'
import { Mapper } from './mapper'
import { PlayableItemMapper } from './playableitem-mapper'

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
