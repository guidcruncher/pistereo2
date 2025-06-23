import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Preset } from '@schemas/index'
import { PlayableItem } from '@views/index'
import * as crypto from 'crypto'
import { Model } from 'mongoose'

@Injectable()
export class PresetsService {
  constructor(@InjectModel(Preset.name) private presetModel: Model<Preset>) {}

  async savePreset(item: Preset, user: string): Promise<any> {
    const preset: Preset = item
    preset.userId = user
    return await this.presetModel.findOneAndUpdate(
      { $and: [{ id: preset.id }, { userId: preset.userId }] },
      preset,
      {
        upsert: true,
      },
    )
  }

  async addPreset(item: PlayableItem, user: string): Promise<any> {
    const preset: Preset = item as Preset
    preset.userId = user
    preset.id = crypto.randomUUID()

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
