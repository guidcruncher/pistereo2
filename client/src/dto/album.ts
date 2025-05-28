import { Context } from './context'
import { Uri } from './uri'
import { type PlayableItem } from './playableitem'

export class Album implements PlayableItem {
  context: Context = new Context()
  parent: any = undefined
  uri: Uri = new Uri()
  url: string = ''
  name: string = ''
  subtitle: string = ''
  description: string = ''
  artists: string[] = [] as string[]
  imageUrl: string = ''
  owner: string = ''

  static create(uri: string, name: string, artists: string[], images: any[]) {
    let alb = new Album()
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
