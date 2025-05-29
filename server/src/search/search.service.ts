import { Injectable } from '@nestjs/common'
import { SpotifyPlayerService } from '../spotify/spotify-player.service'
import { LibrespotPlayerService } from '../spotify/librespot-player.service'
import { TuneinPlayerService } from '../tunein/tunein-player.service'
import { UserStreamPlayerService } from '../userstream/userstream-player.service'

@Injectable()
export class SearchService {
  constructor(
    private readonly spotifyPlayer: SpotifyPlayerService,
    private readonly tuneinPlayer: TuneinPlayerService,
    private readonly userStreamPlayer: UserStreamPlayerService,
  ) {}

  async query(token: string, user: any, query: string, offset: number, limit: number) {
    return await this.tuneinPlayer.search(query, offset, limit)
  }

  async search(token: string, user: any, query: any, offset: number, limit: number) {
    return {}
  }
}
