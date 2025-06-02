import { Context } from './context'
import { PlayableItem } from './playableitem'
import { Show } from './show'
import { Uri } from './uri'

export class Episode implements PlayableItem {
  show: Show = new Show()

  context: Context = new Context()

  uri: Uri = new Uri()

  url = ''

  owner = ''

  name = ''

  subtitle = ''

  description = ''

  artists: string[] = [] as string[]

  imageUrl = ''

  position = 0

  duration = 0
}
