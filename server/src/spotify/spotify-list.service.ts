import { HttpException, Injectable } from '@nestjs/common'
import { HttpTransportService } from '@core/http-transport.service'
import {
  PlaylistDefinition,
  PagedListBuilder,
  PlayableItemList,
  PlayableItem,
  PagedList,
} from '@views/index'
import { PlaylistMapper, PlayableItemMapper, PlayableItemListMapper } from '@mappers/index'

@Injectable()
export class SpotifyListService {
  constructor(private readonly transport: HttpTransportService) {}

  async getPlaylist(
    token: string,
    uri: string,
    offset: number,
    limit: number,
  ): Promise<PlayableItemList> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/playlists/${uri}${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PlayableItemListMapper(result.value)
  }

  async getPlaylists(
    token: string,
    user: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<PlaylistDefinition>> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/users/${user}/playlists${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlaylistDefinition>(result.value, PlaylistMapper)
  }

  async getMyPlaylists(
    token: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<PlaylistDefinition>> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/me/playlists${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlaylistDefinition>(result.value, PlaylistMapper)
  }

  async getSavedAlbums(
    token: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<PlayableItem>> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/me/albums${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlayableItem>(result.value, PlayableItemMapper, 'album')
  }

  async getSavedEpisodes(
    token: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<PlayableItem>> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/me/episodes${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlayableItem>(
      result.value,
      PlayableItemMapper,
      'episode',
    )
  }

  async getSavedShows(
    token: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<PlayableItem>> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/me/shows${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlayableItem>(result.value, PlayableItemMapper, 'show')
  }

  async getSavedTracks(
    token: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<PlayableItem>> {
    let query = this.transport.getQueryString({ offset: offset, limit: limit })
    let result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/me/tracks${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlayableItem>(result.value, PlayableItemMapper, 'track')
  }
}
