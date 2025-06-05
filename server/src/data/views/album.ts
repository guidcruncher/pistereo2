import { Context } from './context'
import { PlayableItem } from './playableitem'
import { Uri } from './uri'

export class Album implements PlayableItem {
  context: Context = new Context()

  uri: Uri = new Uri()

  url = ''

  name = ''

  subtitle = ''

  description = ''

  artists: string[] = [] as string[]

  imageUrl = ''

  owner = ''

  static create(uri: string, name: string, artists: string[], images: any[]) {
    const alb = new Album()
    alb.uri = Uri.fromUriString(uri)
    alb.name = name
    alb.artists = artists
    alb.imageUrl = ''
    if (images) {
      if (images.length > 0) {
        alb.imageUrl = images.sort((a, b) => b.height - a.height)[0].url
      }
    }
    return alb
  }
}
