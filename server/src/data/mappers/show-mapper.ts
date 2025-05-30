import { Mapper, imageUrl } from './mapper'
import { Uri } from '../views/uri'
import { Context } from '../views/context'
import { Show } from '../views/show'

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
