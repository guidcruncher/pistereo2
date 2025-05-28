import { Uri, Profile } from './index'

export class PlaylistDefinition {
  uri: Uri = new Uri()
  name: string = ''
  description: string = ''
  owner: Profile = new Profile()
  imageUrl: string = ''
}
