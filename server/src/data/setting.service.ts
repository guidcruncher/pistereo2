import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Setting } from '@schemas/index'
import { Mixer } from '@views/index'
import { Model } from 'mongoose'

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

  async getFlags(userId: string) {
    const res = await this.settingModel.findOne({ userId: userId }).lean().exec()
    if (res) {
      return res.flags as Record<string, any>
    }

    return {} as Record<string, any>
  }

  async setFlags(userId: string, flags: Record<string, any>) {
    let currentFlags = await this.getFlags(userId)
    if (currentFlags) {
      currentFlags = { ...currentFlags, ...flags }
    } else {
      currentFlags = flags
    }

    return await this.settingModel.findOneAndUpdate(
      { userId: userId },
      { flags: currentFlags },
      {
        upsert: true,
      },
    )
  }

  async setFlag(userId: string, key: string, value: any) {
    let currentFlags = await this.getFlags(userId)
    if (!currentFlags) {
      currentFlags = {} as Record<string, any>
    }

    currentFlags[key] = value

    return await this.settingModel.findOneAndUpdate(
      { userId: userId },
      { flags: currentFlags },
      {
        upsert: true,
      },
    )
  }
}
