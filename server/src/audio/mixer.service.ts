import { Injectable, Logger } from '@nestjs/common'
import { Channel, Frequency, Mixer } from '@views/index'
import * as cp from 'child_process'
import * as fs from 'node:fs'
import { MediaServerService } from '../data/media-server.service'
import { MediaServer } from '@schemas/index'

@Injectable()
export class MixerService {
  private readonly logger = new Logger(MixerService.name, { timestamp: true })

  constructor(private readonly deviceService: MediaServerService) {}

  async getMixer(device: string): Promise<Mixer> {
    return await this.deviceService.mediaServerRequest('', 'GET', '/mixer/equal', {})
  }

  async updateMixer(device: string, mixer: Mixer) {
    return await this.deviceService.mediaServerRequest('', 'PUT', '/mixer/equal', mixer)
  }

  async resetMixer(device: string, level: number) {
    return await this.deviceService.mediaServerRequest('', 'PUT', '/mixer//equal/reset', {})
  }
}
