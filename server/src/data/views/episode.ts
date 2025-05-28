import { Show } from './show'
import { Context } from './context'
import { Uri } from './uri'
import { PlayableItem } from './playableitem'

export class Episode implements PlayableItem {
  show: Show = new Show()
  context: Context = new Context()
  uri: Uri = new Uri()
  url: string = ''
  owner: string = ''
  name: string = ''
  subtitle: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
  position: number = 0
  duration: number = 0
}
