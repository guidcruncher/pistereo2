import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Connection } from 'mongoose'
import { Dependencies, Inject, Injectable } from '@nestjs/common'
import { UserStream } from '@schemas/index'
import { PagedListBuilder } from './views/index'

@Injectable()
export class UserStreamService {
  constructor(@InjectModel(UserStream.name) private userStreamModel: Model<UserStream>) {}

  async saveUserStream(userStream: UserStream): Promise<any> {
    return await this.userStreamModel.findOneAndUpdate(
      { $and: [{ id: userStream.id }, { userId: userStream.userId }] },
      userStream,
      {
        upsert: true,
      },
    )
  }

  async listUserStreams(user: string): Promise<UserStream[]> {
    const res: UserStream[] = (await this.userStreamModel
      .find({ userId: user })
      .sort({ name: 1 })
      .lean()
      .exec()) as UserStream[]

    return res
  }

  async getUserStream(id: string, user: string): Promise<any> {
    return (await this.userStreamModel
      .findOne({ $and: [{ id: id }, { userId: user }] })
      .lean()) as UserStream
  }

  async getUserStreamById(id: string): Promise<any> {
    return (await this.userStreamModel.findOne({ id: id }).lean()) as UserStream
  }

  async search(query: string, offset: number, limit: number) {
    const res = await this.userStreamModel
      .find({ $text: { $search: query } })
      .sort('name')
      .lean()

    return PagedListBuilder.fromMappedArray(res, offset, limit)
  }
}
