import { Uri } from './uri'
import { Context } from './context'

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
