import { UserStream } from '@data/schemas/index'
import { UserStreamService } from '@data/userstream.service'
import { M3uPlaylist, parseM3U } from '@iptv/playlist'
import { Injectable } from '@nestjs/common'
import { Context } from '@views/index'
import { Uri } from '@views/Uri'
import * as crypto from 'crypto'

import { MediaInfoService } from '../metadata/media-info.service'

@Injectable()
export class PlaylistImportService {
  constructor(
    private readonly userStreamService: UserStreamService,
    private readonly mediaInfoService: MediaInfoService,
  ) {}

  async importPlaylist(user: any, m3u: string): Promise<UserStream[]> {
    const result: UserStream[] = [] as UserStream[]
    const playlist: M3uPlaylist = parseM3U(m3u)
    const promises: Promise<any>[] = []
    return new Promise<UserStream[]>((resolve, reject) => {
      const creator = (ch) => {
        return new Promise<UserStream>((res, rej) => {
          const item: UserStream = {} as UserStream
          item.userId = user.id
          item.id = crypto
            .createHash('md5')
            .update((ch.name as string).toLowerCase().trim())
            .digest('hex')
          item.context = new Context()
          item.owner = ''
          item.uri = Uri.fromUriString(`user:stream:${item.id}`)
          item.url = (ch.url as string).trim()
          item.name = (ch.name as string).trim()
          item.subtitle = ''
          item.description = ''
          item.artists = []
          item.imageUrl = ''
          this.mediaInfoService
            .getMediaIconApiUrl(ch.name.trim())
            .then((icon) => {
              item.imageUrl = icon
              this.userStreamService
                .saveUserStream(item)
                .then(() => {
                  res(item)
                })
                .catch(() => {
                  res(item)
                })
            })
            .catch((err) => {
              this.userStreamService
                .saveUserStream(item)
                .then(() => {
                  res(item)
                })
                .catch(() => {
                  res(item)
                })
            })
        })
      }

      for (let i = 0; i < playlist.channels.length; i++) {
        const ch: any = playlist.channels[i] as any
        promises.push(creator(ch))
      }

      Promise.allSettled(promises)
        .then((res) => {
          res.forEach((r) => {
            if (r.status == 'fulfilled') {
              result.push(r.value)
            }
          })

          resolve(result)
        })
        .catch((err) => {
          resolve(result)
        })
    })
  }
}
