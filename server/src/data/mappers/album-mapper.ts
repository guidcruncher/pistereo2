import { imageUrl, Mapper } from './mapper'
import { Uri } from '../views/uri'
import { Context } from '../views/context'
import { Album } from '../views/album'

export const AlbumMapper: Mapper<Album> = (value: any) => {
  let result = new Album()
  result.uri = Uri.fromUriString(value.uri)
  result.name = value.name
  result.imageUrl = ''
  result.owner = value.name

  if (value.images) {
    result.imageUrl = imageUrl(value.images)
  }
  if (value.artists) {
    result.artists = value.artists.map((a) => a.name)
  }

  return result
}
