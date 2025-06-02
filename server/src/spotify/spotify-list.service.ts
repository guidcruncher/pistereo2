import { HttpTransportService } from '@core/http-transport.service'
import { PlayableItemListMapper, PlayableItemMapper, PlaylistMapper } from '@mappers/index'
import { Injectable } from '@nestjs/common'
import {
  PagedList,
  PagedListBuilder,
  PlayableItem,
  PlayableItemList,
  PlaylistDefinition,
  Uri,
} from '@views/index'

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

  async getShowEpisodes(token: string, user: any, uri: string, offset: number, limit: number) {
    const id = Uri.fromUriString(uri).id
    const query = this.transport.getQueryString({
      market: user.country,
      offset: offset,
      limit: limit,
    })
    const result = await this.transport.request(
      'GET',
      `https://api.spotify.com/v1/shows/${id}/episodes${query}`,
      { Authorization: `Bearer ${token}` },
      {},
    )

    return PagedListBuilder.fromPagedObject<PlayableItem>(result.value, PlayableItemMapper)
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
