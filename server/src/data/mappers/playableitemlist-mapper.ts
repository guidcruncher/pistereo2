import { PagedListBuilder, PlayableItem, PlayableItemList } from '../views/index'
import { imageUrl, Mapper } from './mapper'
import { PlayableItemMapper } from './playableitem-mapper'

export const PlayableItemListMapper: Mapper<PlayableItemList> = (value: any) => {
  const result = new PlayableItemList()

  result.id = value.id
  result.uri = value.uri
  result.name = value.name
  result.imageUrl = ''
  result.type = value.type ?? ''
  result.owner = { name: value.owner.display_name, uri: value.owner.uri }
  result.items = PagedListBuilder.fromPagedObject<PlayableItem>(
    value.tracks,
    PlayableItemMapper,
    'track',
  )

  result.imageUrl = imageUrl(value.images)

  return result
}
