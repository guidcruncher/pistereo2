import { Tunein } from '../views/tunein'
import { Uri } from '../views/uri'
import { Mapper } from './mapper'

export const TuneinMapper: Mapper<Tunein> = (value: any) => {
  const result = new Tunein()
  result.uri = Uri.fromUriString('tunein:station:' + value.GuideId)
  result.name = value.Title
  result.owner = value.Subtitle ?? ''
  result.subtitle = value.Subtitle ?? ''
  result.description = value.Description ?? ''
  result.url = value.url ?? ''
  result.imageUrl = value.Image
  return result
}
