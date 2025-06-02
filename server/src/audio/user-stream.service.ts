import { UserStreamService as UserStreamDataService } from '@data/userstream.service'
import { Injectable } from '@nestjs/common'
import { UserStream } from '@schemas/index'
import { Uri } from '@views/uri'
import * as crypto from 'crypto'

import { AuthService } from '../auth/auth.service'

@Injectable()
export class UserStreamService {
  constructor(
    private readonly userstreamService: UserStreamDataService,
    private readonly authService: AuthService,
  ) {}

  async getUserStreams(token: string, user: any) {
    return await this.userstreamService.listUserStreams(user.id)
  }

  async getUserStream(token: string, user: any, id: string) {
    return await this.userstreamService.getUserStream(id, user.id)
  }

  async saveUserStream(token: string, user: any, userstream: UserStream) {
    const item: UserStream = userstream
    if (userstream.id === '') {
      item.uri = Uri.fromUriString(`user:stream:${crypto.randomUUID().replaceAll('-', '')}`)
      item.id = item.uri.id
      item.userId = user.id
    }

    return await this.userstreamService.saveUserStream(item)
  }
}
