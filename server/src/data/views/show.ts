import { Context } from './context'
import { PlayableItem } from './playableitem'
import { Uri } from './uri'

export class Show implements PlayableItem {
  publisher = ''

  context: Context = new Context()

  uri: Uri = new Uri()

  url = ''

  name = ''

  owner = ''

  subtitle = ''

  description = ''

  artists: string[] = [] as string[]

  imageUrl = ''
}
