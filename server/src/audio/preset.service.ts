import { PresetsService } from '@data/presets.service'
import { Injectable } from '@nestjs/common'
import { Preset } from '@schemas/index'
import { PlayableItem } from '@views/index'
import * as crypto from 'crypto'

import { AuthService } from '../auth/auth.service'

@Injectable()
export class PresetService {
  constructor(
    private readonly presetsService: PresetsService,
    private readonly authService: AuthService,
  ) {}

  async getPresets(token: string, user: any) {
    return await this.presetsService.listPresets(user.id)
  }

  async getPreset(token: string, user: any, id: string) {
    return await this.presetsService.getPreset(id, user.id)
  }

  async savePreset(token: string, user: any, preset: Preset) {
    const item: Preset = preset
    if (item.presetid === '') {
      item.presetid = crypto.randomUUID()
    }

    item.id = item.uri.id

    return await this.presetsService.savePreset(item, user.id)
  }

  async addPreset(token: string, user: any, data: PlayableItem) {
    const item = new Preset()
    item.context = data.context
    item.uri = data.uri
    item.url = data.url
    item.name = data.name
    item.subtitle = data.subtitle
    item.description = data.description
    item.owner = data.owner
    item.artists = data.artists
    item.imageUrl = data.imageUrl
    return await this.savePreset(token, user, item)
  }
}
