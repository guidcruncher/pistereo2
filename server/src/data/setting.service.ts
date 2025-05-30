import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Connection } from 'mongoose'
import { Dependencies, Inject, Injectable } from '@nestjs/common'
import { Mixer } from '@views/index'
import { Session, Setting } from '@schemas/index'

@Injectable()
export class SettingService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) {}

  async updateVolume(userId: string, volume: number) {
    return await this.settingModel.findOneAndUpdate(
      { userId: userId },
      { volume: volume },
      {
        upsert: true,
      },
    )
  }

  async updateMixer(userId: string, mixer: Mixer) {
    return await this.settingModel.findOneAndUpdate(
      { userId: userId },
      { mixer: mixer },
      {
        upsert: true,
      },
    )
  }

  async getSetting(userId: string) {
    return await this.settingModel.findOne({ userId: userId }).lean().exec()
  }
}
