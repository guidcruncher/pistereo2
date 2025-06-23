import { Profile, Uri } from './index'

export class PlaylistDefinition {
  uri: Uri = new Uri()

  name = ''

  description = ''

  owner: Profile = new Profile()

  imageUrl = ''
}
