import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MediaServer } from '@schemas/index'
import * as crypto from 'crypto'
import { Model } from 'mongoose'

@Injectable()
export class MediaServerService {
  constructor(@InjectModel(MediaServer.name) private deviceodel: Model<MediaServer>) {}

  async saveDevice(item: MediaServer) {
    return await this.deviceModel.findOneAndUpdate({ id: item.id }, item, { upsert: true })
  }

  async find(id: string) {
    const item = await this.deviceModel.findOne({ id: id }).lean()
    return item
  }

  async getActive() {
    const items = await this.deviceModel.find().lean()
    return items
  }

  async delete(id: string) {
    const item = await this.deviceModel.findOne({ id: id }).remove()
    return item
  }
}
