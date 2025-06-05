import { Episode } from '../views/episode'
import { Uri } from '../views/uri'
import { imageUrl, Mapper } from './mapper'

export const EpisodeMapper: Mapper<Episode> = (value: any) => {
  const result = new Episode()
  result.uri = Uri.fromUriString(value.uri)
  result.name = value.name
  result.imageUrl = ''
  result.description = value.description
  result.position = value.position ?? 0
  result.duration = value.duration ?? 0

  if (value.show) {
    if (value.show.uri && value.show.uri != '') {
      result.show.uri = Uri.fromUriString(value.show.uri)
    }

    result.show.imageUrl = ''
    result.show.imageUrl = imageUrl(value.show.images)
    result.show.description = value.show.description
    result.show.publisher = value.show.publisher
    result.owner = value.show.name
    result.show.name = value.show.name
  }

  result.imageUrl = result.show.imageUrl

  if (value.images) {
    result.imageUrl = imageUrl(value.images)
  }

  return result
}
