import { Album } from './album'
import { Context } from './context'
import { Uri } from './uri'
import { PlayableItem } from './playableitem'

export class Tunein implements PlayableItem {
  album: Album = new Album()
  context: Context = new Context()
  uri: Uri = new Uri()
  url: string = ''
  name: string = ''
  owner: string = ''
  subtitle: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
}
