import { imageUrl, Mapper } from './mapper'
import { Profile } from '../views/profile'

export const ProfileMapper: Mapper<Profile> = (value: any) => {
  let result = new Profile()

  result.imageUrl = imageUrl(value.images)

  result.id = value.id
  result.uri = value.uri
  result.email = value.email
  result.name = value.display_name
  result.country = value.country

  return result
}
