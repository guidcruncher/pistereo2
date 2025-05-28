import { Show } from './show'
import { Context } from './context'
import { Uri } from './uri'
import { type PlayableItem } from './playableitem'

export class Episode implements PlayableItem {
  parent: any = new Show()
  context: Context = new Context()
  uri: Uri = new Uri()
  url: string = ''
  owner: string = ''
  name: string = ''
  subtitle: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
}
