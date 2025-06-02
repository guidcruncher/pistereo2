import { Track } from '../views/track'
import { Uri } from '../views/uri'
import { imageUrl, Mapper } from './mapper'

export const TrackMapper: Mapper<Track> = (value: any) => {
  const result = new Track()
  result.uri = Uri.fromUriString(value.uri)
  result.name = value.name
  result.imageUrl = ''
  result.position = value.position ?? 0
  result.duration = value.duration ?? 0

  if (value.artists) {
    result.artists = value.artists.map((a) => a.name)
  }
  result.owner = value.album.name
  if (value.album.uri) {
    result.album.uri = Uri.fromUriString(value.album.uri)
  }

  result.album.name = value.album ? (value.album.name ?? '') : ''
  result.album.imageUrl = ''
  if (value.album) {
    result.album.imageUrl = imageUrl(value.album.images)
  }
  result.imageUrl = result.album.imageUrl

  if (value.images) {
    result.imageUrl = imageUrl(value.images)
  }
  if (value.album.artists) {
    result.album.artists = value.album.artists.map((a) => a.name)
  }

  result.artists = result.album.artists
  if (value.artists) {
    result.artists = value.artists.map((a) => a.name)
  }

  return result
}
