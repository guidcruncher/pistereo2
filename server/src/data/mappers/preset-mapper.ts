import { imageUrl, Mapper } from './mapper'
import { PlayableItem, Uri, Context } from '../views/index'
import { Preset } from '../schemas/index'

export const PresetMapper: Mapper<PlayableItem> = (value: Preset) => {
  let result: PlayableItem = {} as PlayableItem
  result.uri = Uri.fromUriString(value.id)
  result.owner = value.owner
  result.uri = value.uri
  result.url = value.url
  result.name = value.name
  result.subtitle = value.subtitle
  result.description = value.description
  result.artists = value.artists
  result.imageUrl = value.imageUrl
  return result
}
