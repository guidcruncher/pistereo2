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

  private async parseContents(data: string): Promise<Mixer> {
    let m: Mixer = new Mixer()
    let lines: string[] = data
      .split('\n')
      .filter((n) => n && n.trim() != '')
      .map((n) => {
        let v: string = n.trim()
        if (v.startsWith('; ') || v.startsWith(': ')) {
          v = v.slice(2)
        }
        return v
      })
    let i: number = 0

    while (i < lines.length) {
      if (lines[i].startsWith('num')) {
        let obj = {} as any
        let fields: string[] =
          `${lines[i]},${lines[i + 1].replaceAll('values', 'channels')},${lines[i + 2]}`
            .replaceAll("'", '')
            .split(',')
        fields.map((a) => {
          let b = a.split('=')
          obj[b[0]] = b[1]
          return b
        })

        let f = new Frequency()
        f.numid = parseInt(obj['numid'])
        f.min = parseInt(obj['min'])
        f.max = parseInt(obj['max'])
        f.steps = parseInt(obj['step'])
        f.name = obj['name'] ?? ''
        f.channels = obj['values'].map((v) => {
          return { name: '', value: v }
        })
        m.frequencies.push(f)
        i = i + 2
      }
      i = i + 1
    }

    return m
  }
}
3
