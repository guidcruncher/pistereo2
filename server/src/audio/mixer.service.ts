import { Channel, Mixer, Frequency } from '@views/index'
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class MixerService {
  async getMixer(device: string): Promise<Mixer> {
    const equal: Mixer = await this.contents(device)
    return equal
  }

  private async sset(device: string, name: string, values: Channel[]) {
    return await this.amixer([
      '-D',
      device,
      'sset',
      `"${name}"`,
      `${values
        .map((a) => {
          return a.value
        })
        .join(', ')}`,
    ])
  }

  private async contents(device: string): Promise<Mixer> {
    return new Promise<Mixer>((resolve, reject) => {
      this.amixer(['-D', device, 'contents']).then((res: string) =>
        this.parseContents(res)
          .then((contents) => {
            resolve(contents)
          })
          .catch((err) => {
            reject(err)
          }),
      )
    })
  }

  private async amixer(params): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      const amixer = cp.spawn('/usr/bin/amixer', params)

      amixer.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      amixer.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      amixer.on('close', (code) => {
        if (code === 0) {
          resolve(stdout)
        } else {
          reject(new Error(stderr))
        }
      })
    })
  }

  private async parseContents(data): Promise<Mixer> {
    let m: Mixer = new Mixer()

    return m
  }
}
