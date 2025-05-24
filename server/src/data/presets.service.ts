import { InjectModel } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Connection } from 'mongoose'
import { Inject, Injectable, Dependencies } from '@nestjs/common'
import { PlayableItem } from '@views/index'
import { Preset } from '@schemas/index'

@Injectable()
export class PresetsService {
  constructor(@InjectModel(Preset.name) private presetModel: Model<Preset>) {}

  async savePreset(item: Preset, user: string): Promise<any> {
    let preset: Preset = item as Preset
    preset.userId = user
    return await this.presetModel.findOneAndUpdate(
      { $and: [{ id: preset.id }, { userId: preset.userId }] },
      preset,
      {
        upsert: true,
      },
    )
  }

  async listPresets(user: string): Promise<PlayableItem[]> {
    const res: Preset[] = (await this.presetModel
      .find({ userId: user })
      .sort({ name: 1 })
      .lean()
      .exec()) as Preset[]

    return res as PlayableItem[]
  }

  async getPreset(id: string, user: string): Promise<any> {
    return (await this.presetModel
      .findOne({ $and: [{ id: id }, { userId: user }] })
      .lean()) as PlayableItem
  }
}
