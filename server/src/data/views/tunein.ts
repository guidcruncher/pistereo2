import { Album } from './album'
import { Context } from './context'
import { PlayableItem } from './playableitem'
import { Uri } from './uri'

export class Tunein implements PlayableItem {
  album: Album = new Album()

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
