import { Logger } from '@nestjs/common'
import { HttpException, Injectable } from '@nestjs/common'
import { HttpTransportService } from '@core/http-transport.service'
import {
  PagedList,
  PagedListBuilder,
  PlayableItem,
  PlayableItemList,
  PlaylistDefinition,
} from '@views/index'
import { PlayableItemListMapper, PlayableItemMapper, PlaylistMapper } from '@mappers/index'

@Injectable()
export class SpotifyListService {
  constructor(private readonly transport: HttpTransportService) {}

  async getPlaylist(
    token: string,
    uri: string,
    offset: number,
    limit: number,
  ): Promise<PlayableItemList> {
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
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
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
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
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
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
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
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
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
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
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
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
    const query = this.transport.getQueryString({ offset: offset, limit: limit })
    const result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/me/tracks${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlayableItem>(result.value, PlayableItemMapper, 'track')
  }
}
