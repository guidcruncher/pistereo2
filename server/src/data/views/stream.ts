import { Context } from './context'
import { Uri } from './uri'
import { PlayableItem } from './playableitem'

export class Stream implements PlayableItem {
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
