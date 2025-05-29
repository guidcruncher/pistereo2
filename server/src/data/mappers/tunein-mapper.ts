import { imageUrl, Mapper } from './mapper'
import { Uri } from '../views/uri'
import { Context } from '../views/context'
import { Tunein } from '../views/tunein'

export const TuneinMapper: Mapper<Tunein> = (value: any) => {
  let result = new Tunein()
  result.uri = Uri.fromUriString('tunein:station:' + value.GuideId)
  result.name = value.Title
  result.owner = value.Subtitle ?? ''
  result.subtitle = value.Subtitle ?? ''
  result.description = value.description ?? ''
  result.url = value.url ?? ''
  result.imageUrl = value.Image
  return result
}
