import { Context } from './context'
import { PlayableItem } from './playableitem'
import { Uri } from './uri'

export class Stream implements PlayableItem {
  context: Context = new Context()

  uri: Uri = new Uri()

  url = ''

  name = ''

  subtitle = ''

  owner = ''

  description = ''

  artists: string[] = [] as string[]

  imageUrl = ''
}
