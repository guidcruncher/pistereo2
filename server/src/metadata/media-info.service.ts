import { Logger } from 'nestjs-pino'
import { default as stream } from 'node:stream'
import type { ReadableStream } from 'node:stream/web'

import { Injectable, NotFoundException } from '@nestjs/common'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as htmlparser2 from 'htmlparser2'
import * as path from 'path'
import { finished } from 'stream/promises'

@Injectable()
export class MediaInfoService {
  public async getMediaIcon(name: string, res: any) {
    const id: string = name.replaceAll(' ', '-').toLowerCase()
    if (name === '') {
      throw new NotFoundException()
    }

    const baseDir = path.join(process.env.PISTEREO_CACHE as string, 'icons')
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir)
    }
    const filename = path.join(baseDir, crypto.createHash('md5').update(id).digest('hex') + '.png')

    if (fs.existsSync(filename)) {
      var filestream = fs.createReadStream(filename)
      return filestream.pipe(res)
    }

    const download = async (url, fileName) => {
      const res = await fetch(url)
      const destination = fileName
      const fileStream = fs.createWriteStream(destination, { flags: 'wx' })
      await finished(
        stream.Readable.fromWeb(res.body as ReadableStream<Uint8Array>).pipe(fileStream),
      )
    }

    const url: string = await this.getMediaIconUrl(id)

    if (url == '') {
      throw new NotFoundException()
    }

    await download(url, filename)
    var filestream = fs.createReadStream(filename)
    return filestream.pipe(res)
  }

  public async getMediaIconApiUrl(name: string): Promise<string> {
    const id: string = name.replaceAll(' ', '-').toLowerCase()
    const url: string = '/api/metadata/icon?query=' + encodeURIComponent(id)
    return url
  }

  public async getMediaIconUrl(name: string): Promise<string> {
    const id: string = name.replaceAll(' ', '-').toLowerCase()
    const url: string = 'https://media.info/radio/stations/' + id
    let iconurl = ''
    const result = await fetch(url, { method: 'GET' })

    if (!result.ok) {
      return ''
    }

    const html = await result.text()

    const parser = new htmlparser2.Parser({
      onopentag(name, attributes) {
        if (name === 'meta' && attributes.property === 'og:image') {
          if (attributes.content.startsWith('http')) {
            iconurl = attributes.content
          } else {
            iconurl = 'https://media.info' + attributes.content
          }
        }
      },
    })
    parser.write(html)
    parser.end()

    console.log(iconurl)
    return iconurl
  }
}
