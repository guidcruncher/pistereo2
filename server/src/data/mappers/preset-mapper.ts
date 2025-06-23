import { Preset } from '../schemas/index'
import { PlayableItem, Uri } from '../views/index'
import { Mapper } from './mapper'

export const PresetMapper: Mapper<PlayableItem> = (value: Preset) => {
  const result: PlayableItem = {} as PlayableItem
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
