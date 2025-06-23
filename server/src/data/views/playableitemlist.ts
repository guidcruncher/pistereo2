import { Owner } from './owner'
import { PagedList } from './pagedlist'
import { PlayableItem } from './playableitem'

export class PlayableItemList {
  owner: Owner = new Owner()

  id = ''

  uri = ''

  name = ''

  artists: string[] = [] as string[]

  imageUrl = ''

  type = ''

  items: PagedList<PlayableItem>

  constructor() {
    this.items = new PagedList<PlayableItem>()
  }
}
