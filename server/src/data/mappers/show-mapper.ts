import { Show } from '../views/show'
import { Uri } from '../views/uri'
import { imageUrl, Mapper } from './mapper'

export const ShowMapper: Mapper<Show> = (value: any) => {
  const result = new Show()
  result.uri = Uri.fromUriString(value.uri)
  result.name = value.name
  result.owner = value.name
  result.imageUrl = ''
  result.imageUrl = imageUrl(value.images)
  result.description = value.description
  result.publisher = value.publisher

  return result
}
