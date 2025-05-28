import { Context } from './context'
import { Uri } from './uri'
import { type PlayableItem } from './playableitem'

export class Show implements PlayableItem {
  parent: any = undefined
  publisher: string = ''
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
