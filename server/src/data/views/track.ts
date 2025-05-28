import { Album } from './album'
import { Context } from './context'
import { Uri } from './uri'
import { PlayableItem } from './playableitem'

export class Track implements PlayableItem {
  album: Album = new Album()
  context: Context = new Context()
  uri: Uri = new Uri()
  url: string = ''
  name: string = ''
  subtitle: string = ''
  owner: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
  position: number = 0
  duration: number = 0
}
