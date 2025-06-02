import { AuthService } from '@auth/auth.service'
import { UserStreamService } from '@data/userstream.service'
import { PlayableItemMapper } from '@mappers/index'
import { HttpException, Injectable } from '@nestjs/common'
import { Uri } from '@views/index'

import { MpvPlayerService } from '../mpv/mpv-player.service'

@Injectable()
export class UserStreamPlayerService {
  constructor(
    private readonly userStreamService: UserStreamService,
    private readonly mpvPlayer: MpvPlayerService,
    private readonly authService: AuthService,
  ) {}

  public async getStatus() {
    const state = await this.mpvPlayer.getStatus()
    return state
  }

  async getMetaData(uriParts: Uri) {
    if (uriParts.source != 'user') {
      throw new HttpException(`Invalid uri source, expected user got ${uriParts.source}`, 400)
    }

    const userStream: any = await this.userStreamService.getUserStreamById(uriParts.id)
    if (userStream) {
      userStream.uri = uriParts
      return PlayableItemMapper(userStream)
    }

    throw new HttpException('User stream not found', 404)
  }

  async play(token: string, user: any, uriParts: Uri) {
    if (uriParts.source != 'user') {
      throw new HttpException(`Invalid uri source, expected user got ${uriParts.source}`, 400)
    }

    if (user) {
      const userStream: any = await this.userStreamService.getUserStream(uriParts.id, user.id)
      if (userStream) {
        await this.mpvPlayer.play(userStream.url)
        userStream.uri = uriParts
        return PlayableItemMapper(userStream)
      }
    }

    throw new HttpException('User stream not found', 404)
  }

  public async search(q: string, offset: number, limit: number): Promise<any> {
    return await this.userStreamService.search(q, offset, limit)
  }
}
