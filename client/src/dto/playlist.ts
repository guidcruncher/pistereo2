import { Uri } from './uri'
import { PagedList } from './pagedlist'
import { Owner } from './owner'
import { type PlayableItem } from './playableitem'

export class Playlist extends PagedList<PlayableItem> {
  uri: Uri = new Uri()
  name: string = ''
  description: string = ''
  owner: Owner = new Owner()
  imageUrl: string = ''
}
