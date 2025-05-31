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

  async query(
    token: string,
    user: any,
    source: string,
    query: string,
    offset: number,
    limit: number,
  ) {
    let res: any
    let pager: Pager = new Pager()

    switch (source) {
      case 'radio':
        res = await this.tuneinPlayer.search(query, offset, limit)
        break
      case 'stream':
        res = await this.userStreamPlayer.search(query, offset, limit)
        break
      case 'album':
      case 'show':
      case 'track':
      case 'episode':
      case 'playlist':
        res = await this.spotifyPlayer.search(token, user, source, query, offset, limit)

        break
    }
    return res
  }
}
