import { Context } from './context'
import { Uri } from './uri'
import { type PlayableItem } from './playableitem'

export class Stream implements PlayableItem {
  context: Context = new Context()
  parent: any = undefined
  uri: Uri = new Uri()
  url: string = ''
  name: string = ''
  subtitle: string = ''
  owner: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
}
