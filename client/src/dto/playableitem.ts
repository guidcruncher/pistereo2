import { Uri } from './uri'
import { Context } from './context'

export interface PlayableItem {
  context: Context
  parent: any
  uri: Uri
  url: string
  name: string
  subtitle: string
  description: string
  owner: string
  artists: string[]
  imageUrl: string
}

export const CreatePlayableItem = (v: any) => {
  let res: PlayableItem = {} as PlayableItem
  switch (v.uri.source) {
    case 'tunein':
    case 'user':
      res = v as PlayableItem
      break
    case 'spotify':
      switch (v.uri.type) {
        case 'track':
          res = v as PlayableItem
          res.owner = v.album
          break
        case 'episode':
          res = v as PlayableItem
          res.owner = v.show
          break
        default:
          res = v as PlayableItem
      }
      break
  }

  return res
}
