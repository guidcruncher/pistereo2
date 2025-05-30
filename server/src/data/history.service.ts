import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Connection } from 'mongoose'
import { Dependencies, Inject, Injectable } from '@nestjs/common'
import { PlayableItem } from '@views/index'
import { History, LastPlayed } from '@schemas/index'
import * as crypto from 'crypto'

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
    @InjectModel(LastPlayed.name) private lastPlayedModel: Model<LastPlayed>,
  ) {}

  async saveHistory(item: History, user: string) {
    const history: History = item
    history.userId = user
    history.source = history.uri.source
    return await this.historyModel.findOneAndUpdate(
      { $and: [{ historyid: history.id }, { userId: history.userId }] },
      history,
      {
        upsert: true,
      },
    )
  }

  async addAnonHistory(item: PlayableItem) {
    const history: History = item as History
    history.userId = 'remote'
    history.source = history.uri.source
    history.id = history.uri.id
    history.historyid = crypto.randomUUID()
    history.timestamp = Date.now()
    return await this.historyModel.create(history)
  }

  async clearLastPlayed() {
    return await this.lastPlayedModel.deleteMany()
  }

  async getLastPlayed(user: string) {
    const item = await this.lastPlayedModel.findOne({ userId: user }).lean()

    if (!item && user != 'remote') {
      return await this.getLastPlayed('remote')
    }
    return item
  }

  async addLastPlayed(item: PlayableItem, user: string) {
    const history: LastPlayed = item as LastPlayed
    history.userId = user
    history.source = history.uri.source
    history.id = history.uri.id
    history.timestamp = Date.now()

    return await this.lastPlayedModel.findOneAndUpdate({ userId: user }, history, {
      upsert: true,
    })
  }

  async addHistory(item: PlayableItem, user: string) {
    const history: History = item as History
    history.userId = user
    history.source = history.uri.source
    history.id = history.uri.id
    history.historyid = crypto.randomUUID()
    history.timestamp = Date.now()
    return await this.historyModel.create(history)
  }
  3

  async listHistory(user: string): Promise<History[]> {
    const res: History[] = (await this.historyModel
      .find({ userId: user })
      .sort({ name: 1 })
      .lean()
      .exec()) as History[]

    return res
  }

  async getLastPlayedList(user: string): Promise<History[]> {
    const res: History[] = (await this.historyModel
      .find({ userId: user })
      .sort({ timestamp: -1 })
      .lean()
      .exec()) as History[]

    return res
  }

  async getLastPlayedBySource(user: string, source: string): Promise<History[]> {
    const res: History[] = (await this.historyModel
      .find({ $and: [{ userId: user }, { source: source }] })
      .sort({ timestamp: -1 })
      .lean()
      .exec()) as History[]

    return res
  }

  async getHistory(historyid: string, user: string) {
    return await this.historyModel
      .findOne({ $and: [{ historyid: historyid }, { userId: user }] })
      .lean()
  }
}
