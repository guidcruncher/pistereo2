import { PagedList } from './pagedlist'
import { type PlayableItem } from './playableitem'
import { Owner } from './owner'

export class PlayableItemList {
  owner: Owner = new Owner()

  id: string = ''
  uri: string = ''
  name: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
  type: string = ''

  items: PagedList<PlayableItem>

  constructor() {
    this.items = new PagedList<PlayableItem>()
  }
}
