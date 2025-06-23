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

export const LibrespotMetadataMapper: Mapper<PlayableItem> = (data: any): PlayableItem => {
  const parts: string[] = data.uri.split(':')
  const uri = new Uri()
  uri.source = parts[0]
  uri.type = parts[1]
  uri.id = parts[2]

  const value = {
    uri: uri,
    name: data.name,
    artists: data.artist_names.map((a) => {
      return { name: a }
    }),
    duration: data.duration,
    position: data.position,
    album: {
      name: data.album_name,
      images: [{ width: 300, height: 300, url: data.album_cover_url }],
      artists: data.artist_names.map((a) => {
        return { name: a }
      }),
    },
    show: {
      name: data.album_name,
      images: [{ width: 300, height: 300, url: data.album_cover_url }],
      artists: data.artist_names.map((a) => {
        return { name: a }
      }),
    },
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
      }
      break
    case 'tunein':
      return TuneinMapper(value)
    case 'user':
      return UserStreamMapper(value)
  }
  throw new Error('Invalid input to mapper')
}
