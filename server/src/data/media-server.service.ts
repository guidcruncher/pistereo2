import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MediaServer } from '@schemas/index'
import * as crypto from 'crypto'
import { Model } from 'mongoose'

@Injectable()
export class MediaServerService {
  constructor(@InjectModel(MediaServer.name) private deviceModel: Model<MediaServer>) {}

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
    const item = await this.deviceModel.deleteOne({ id: id })
    return item
  }

  async mediaServerOp(method: string, url: string, body: any = {}) {
    let devices = await this.getActive()
    if (!devices) {
      return 0
    }

    for (var i = 0; i < devices.length; i++) {
      try {
        let apiUrl = devices[i].apiUrl + url
        let res: any = {}

        if (body && ['PUT', 'POST'].includes(method.toUpperCase())) {
          res = await fetch(apiUrl, {
            method: method.toUpperCase(),
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        } else {
          res = await fetch(apiUrl, {
            method: method.toUpperCase(),
          })
        }
      } catch (err) {
        console.log(err)
      }
    }

    return devices.length
  }

  async mediaServerGet(method: string, url: string, body: any = {}) {
    let devices = await this.getActive()

    if (!devices) {
      return 0
    }

    let res: any = {}

    for (var i = 0; i < devices.length; i++) {
      try {
        let apiUrl = devices[i].apiUrl + url

        if (body && ['PUT', 'POST'].includes(method.toUpperCase())) {
          res = await fetch(apiUrl, {
            method: method.toUpperCase(),
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        } else {
          res = await fetch(apiUrl, {
            method: method.toUpperCase(),
          })
        }
      } catch (err) {
        console.log(err)
      }
    }

    return res
  }
}
