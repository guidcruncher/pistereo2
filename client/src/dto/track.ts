import { Album } from './album'
import { Context } from './context'
import { Uri } from './uri'
import { type PlayableItem } from './playableitem'

export class Track implements PlayableItem {
  parent: any = new Album()
  context: Context = new Context()
  uri: Uri = new Uri()
  url: string = ''
  name: string = ''
  subtitle: string = ''
  owner: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
}
