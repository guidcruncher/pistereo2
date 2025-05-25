import { Logger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class EqualiserService {
  constructor() {}

  async getControls(user: any): Promise<any[]> {
    const equal: any[] = await this.scontents()
    return equal
  }

  resetControls(user: any, level: number): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.scontents().then((ctrls) => {
        const p: Promise<any>[] = []
        for (let i = 0; i < ctrls.length; i++) {
          p.push(this.sset(ctrls[i].name, level, level))
        }

        Promise.allSettled(p)
          .then(() => {
            this.getControls(user)
              .then((res) => {
                resolve(res)
              })
              .catch((err) => {
                reject(err)
              })
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }

  setControls(user: any, levels: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.scontents().then((ctrls) => {
        const p: Promise<any>[] = []
        for (let i = 0; i < ctrls.length; i++) {
          p.push(this.sset(ctrls[i].name, levels[i].left, levels[i].right))
        }

        Promise.allSettled(p)
          .then(() => {
            resolve(levels)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }

  async setControl(user: any, index: number, left: number, right: number) {
    return new Promise<any[]>((resolve, reject) => {
      this.getControls(user).then((controls) => {
        const ctrl: any = controls.find((c) => {
          return c.num == index
        })
        if (ctrl) {
          this.sset(ctrl.name, left, right)
            .then(async (res) => {
              const state = await this.getControls(user)
              resolve(state)
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          reject('Out of range')
        }
      })
    })
  }

  private sset(name: string, left: number, right: number) {
    return this.amixer(['-D', 'equal', 'sset', `"${name}"`, `${left},${right}`])
  }

  private scontents(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.amixer(['-D', 'equal', 'scontents']).then((res: string) =>
        this.parseSimpleControls(res)
          .then((contents: any[]) => {
            resolve(contents)
          })
          .catch((err) => {
            reject(err)
          }),
      )
    })
  }

  private amixer(params): Promise<string> {
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

  private parseSimpleControls(scontents: string): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      const data: any = []
      let currentControl: any = null
      scontents.split('\n').forEach((line) => {
        const matchControl = line.match(/^([^']+) '([^']+)',(\d+)$/)
        if (matchControl) {
          if (currentControl) {
            data.push(currentControl)
          }

          const [, type, name, index] = matchControl
          currentControl = { type, name, index }

          return
        }

        const matchValue = line.match(/^ {2}([^:]+): ?(.*)$/)
        if (matchValue) {
          const [, key, val] = matchValue
          currentControl[key] = val
        }
      })
      data.push(currentControl)
      data.map((m) => {
        let match = m.name.match(/(\d{2})\. (.*)/)
        if (match) {
          const [, num, name] = match
          m.shortname = name
          m.num = Number(num)
        }

        match = m['Front Left'].match(/^Playback (\d+) \[(\d+)%]/)
        if (match) {
          m.left = Number(match[2])
        }

        match = m['Front Right'].match(/^Playback (\d+) \[(\d+)%]/)
        if (match) {
          m.right = Number(match[2])
        }

        return m
      })

      resolve(data)
    })
  }

  public async saveCurrentAsPreset(name: string, source: string) {
    const presets: any = this.getAllPresets()
    const key: string = 'presets-' + source.toLowerCase()
    const equal: any[] = await this.scontents()
    const parsedEqual = equal.map((a) => {
      return { left: a.left, right: a.right }
    })

    if (presets[key]) {
      const index = presets[key].indexOf((a) => {
        return a.name == name
      })
      if (index >= 0) {
        presets[key][index].values = parsedEqual
      } else {
        presets[key].push({ name: name, values: parsedEqual })
      }
      this.savePresetsFile(presets)
    }
  }

  public getAllPresets(): any {
    const filename = path.join(process.env.NODE_CONFIG_DIR as string, 'equaliser.json')
    if (fs.existsSync(filename)) {
      const rawJS: string = fs.readFileSync(filename, 'utf8')
      const json: any = JSON.parse(rawJS)
      return json
    }

    return { frequencies: [], 'presets-spotify': [], 'presets-streamer': [] }
  }

  public savePresetsFile(presets: any) {
    const filename = path.join(process.env.NODE_CONFIG_DIR as string, 'equaliser.json')
    if (fs.existsSync(filename)) {
      try {
        fs.copyFileSync(filename, filename + '.bak')
      } catch (err) {}
    }

    try {
      fs.writeFileSync(
        path.join(process.env.APPCACHE as string, 'equaliser.json'),
        JSON.stringify(presets),
      )
      fs.writeFileSync(filename, JSON.stringify(presets))
    } catch (err) {}
  }

  public getPresets(source: string): any[] {
    let results: any[] = []
    const filename = path.join(process.env.NODE_CONFIG_DIR as string, 'equaliser.json')

    if (fs.existsSync(filename)) {
      const rawJS: string = fs.readFileSync(filename, 'utf8')
      const json: any = JSON.parse(rawJS)

      if (json && json['presets-' + source]) {
        results = json['presets-' + source]
      }
    }

    return results
  }
}
