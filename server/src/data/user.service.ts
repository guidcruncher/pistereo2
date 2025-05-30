import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Connection } from 'mongoose'
import { Dependencies, Inject, Injectable } from '@nestjs/common'
import { Profile } from '@views/index'
import { Session, User } from '@schemas/index'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async addSession(token: string, refresh: string, user: Profile, expires: number = 3600) {
    const session = new Session()
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + expires)
    session.authToken = token
    session.refreshToken = refresh
    session.expiresAt = expiresAt
    session.user = user
    return await this.sessionModel.findOneAndUpdate({ authToken: token }, session, {
      upsert: true,
    })
  }

  async getSession(token: string) {
    const res = (await this.sessionModel.findOne({ authToken: token }).lean()) as Session
    const expires = new Date()
    expires.setHours(expires.getHours() + 2)

    return res
  }

  async addUser(profile: Profile) {
    const user = new User()
    user.userId = profile.id
    user.uri = profile.uri
    user.imageUrl = profile.imageUrl
    user.email = profile.email
    user.name = profile.name
    user.country = profile.country

    return await this.userModel.findOneAndUpdate({ userId: profile.id }, user, {
      upsert: true,
    })
  }
}
