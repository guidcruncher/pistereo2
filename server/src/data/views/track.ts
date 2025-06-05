import { Album } from './album'
import { Context } from './context'
import { PlayableItem } from './playableitem'
import { Uri } from './uri'

export class Track implements PlayableItem {
  album: Album = new Album()

  context: Context = new Context()

  uri: Uri = new Uri()

  url = ''

  name = ''

  subtitle = ''

  owner = ''

  description = ''

  artists: string[] = [] as string[]

  imageUrl = ''

  position = 0

  duration = 0
}
