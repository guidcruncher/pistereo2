import {
  AlbumMapper,
  EpisodeMapper,
  ShowMapper,
  TrackMapper,
  TuneinMapper,
  UserStreamMapper,
} from '@mappers/index'

import { PlayableItem } from '../views/playableitem'
import { Uri } from '../views/uri'
import { Mapper } from './mapper'

export const PlayableItemMapper: Mapper<PlayableItem> = (value: any): PlayableItem => {
  let uri: Uri = {} as Uri
  if (typeof value.uri === 'string') {
    uri = Uri.fromUriString(value.uri)
  } else {
    if (value.uri instanceof Uri) {
      uri = value.uri
    } else {
      throw new Error('Invalid uri type, expected string or Uri.')
    }
  }

  switch (uri.source) {
    case 'spotify':
      switch (uri.type) {
        case 'album':
          return AlbumMapper(value)
        case 'track':
          return TrackMapper(value)
        case 'show':
          return ShowMapper(value)
        case 'episode':
          return EpisodeMapper(value)
        case 'playlist':
          return {} as PlayableItem
      }
      break
    case 'tunein':
      return TuneinMapper(value)
    case 'user':
      return UserStreamMapper(value)
  }
  throw new Error('Invalid input to mapper')
}
