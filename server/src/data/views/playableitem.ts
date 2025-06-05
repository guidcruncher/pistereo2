import { Context } from './context'
import { Uri } from './uri'

export interface PlayableItem {
  context: Context
  uri: Uri
  url: string
  name: string
  subtitle: string
  description: string
  owner: string
  artists: string[]
  imageUrl: string
}
