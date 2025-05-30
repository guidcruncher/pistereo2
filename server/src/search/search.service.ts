import { Injectable } from '@nestjs/common'
import { SpotifyPlayerService } from '../spotify/spotify-player.service'
import { LibrespotPlayerService } from '../spotify/librespot-player.service'
import { TuneinPlayerService } from '../tunein/tunein-player.service'
import { UserStreamPlayerService } from '../userstream/userstream-player.service'
import { PagedList, PagedListBuilder, Pager, PlayableItem } from '@/data/views'

@Injectable()
export class SearchService {
  constructor(
    private readonly spotifyPlayer: SpotifyPlayerService,
    private readonly tuneinPlayer: TuneinPlayerService,
    private readonly userStreamPlayer: UserStreamPlayerService,
  ) {}

  async query(token: string, user: any, query: string, offset: number, limit: number) {
    let combined: PlayableItem[] = []
    let res: any
    let pager: Pager = new Pager()

    combined = (await this.tuneinPlayer.search(query, offset, limit)).items
    combined.push(...(await this.userStreamPlayer.search(query, offset, limit)).items)

    combined.push(
      ...(await this.spotifyPlayer.search(token, user, 'album', query, offset, limit)).items,
    )
    combined.push(
      ...(await this.spotifyPlayer.search(token, user, 'show', query, offset, limit)).items,
    )
    combined.push(
      ...(await this.spotifyPlayer.search(token, user, 'track', query, offset, limit)).items,
    )
    combined.push(
      ...(await this.spotifyPlayer.search(token, user, 'episode', query, offset, limit)).items,
    )

    combined = combined.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
    const results = PagedListBuilder.fromMappedArray(combined, 0, combined.length)
    results.paging.offset = offset
    results.paging.limit = limit
    return results
  }
}
