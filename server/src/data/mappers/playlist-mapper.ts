import { PlaylistDefinition } from '../views/playlist'
import { Uri } from '../views/uri'
import { imageUrl, Mapper } from './mapper'
import { ProfileMapper } from './profile-mapper'

export const PlaylistMapper: Mapper<PlaylistDefinition> = (value: any) => {
  const result = new PlaylistDefinition()
  result.uri = Uri.fromUriString(value.uri)
  result.name = value.name
  result.description = value.description
  result.owner = ProfileMapper(value.owner)
  result.imageUrl = ''
  result.imageUrl = imageUrl(value.images)
  return result
}
