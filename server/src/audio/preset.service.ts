import { Logger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { PresetsService } from '@data/presets.service'
import { AuthService } from '../auth/auth.service'
import { Preset } from '@schemas/index'
import * as crypto from 'crypto'
import { Uri } from '@views/uri'

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
    let item: Preset = preset
    if (item.presetid === '') {
      item.presetid = crypto.randomUUID()
    }
    item.id = item.uri.id

    return await this.presetsService.savePreset(item, user.id)
  }
}
