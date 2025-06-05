import { Profile } from '../views/profile'
import { imageUrl, Mapper } from './mapper'

export const ProfileMapper: Mapper<Profile> = (value: any) => {
  const result = new Profile()

  result.imageUrl = imageUrl(value.images)

  result.id = value.id
  result.uri = value.uri
  result.email = value.email
  result.name = value.display_name
  result.country = value.country

  return result
}
