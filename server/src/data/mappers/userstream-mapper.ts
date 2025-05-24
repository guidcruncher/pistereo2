import { imageUrl, Mapper } from './mapper'
import { PlayableItem, Uri, Context } from '../views/index'
import { UserStream } from '../schemas/index'

export const UserStreamMapper: Mapper<PlayableItem> = (value: UserStream) => {
  let result: PlayableItem = {} as PlayableItem
  result.uri = value.uri
  result.name = value.name
  result.subtitle = value.subtitle
  result.owner = value.owner
  result.description = value.description
  result.artists = value.artists
  result.imageUrl = value.imageUrl
  result.url = value.url
  return result
}
