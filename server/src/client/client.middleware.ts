import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'node:fs'
import db from 'mime-db'
import { MimeType } from 'mime-type'
import * as path from 'node:path'

@Injectable()
export class ClientMiddleware implements NestMiddleware {
  private readonly mimeType: MimeType = new MimeType(db)

  constructor() {}

  excludePaths: string[] = ['/api', '/docs', '/ws']

  private isExcluded(path: string) {
    for (let i = 0; i < this.excludePaths.length; i++) {
      if (path.startsWith(this.excludePaths[i])) {
        return true
      }
    }

    return false
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (this.isExcluded(req.path.toString().toLowerCase())) {
      next()
      return
    }
    try {
      const clientPath = path.join(process.cwd(), '../client')
      let requestPath = new URL('http://127.0.0.1' + req.url).pathname

      if (requestPath == '/') {
        requestPath = '/index.html'
      }

      let filename = path.join(clientPath, requestPath)

      if (!fs.existsSync(filename)) {
        filename = path.join(clientPath, '/index.html')
      }

      const fileExtn: string = path.extname(filename)
      const contentType: string = this.mimeType.lookup(filename)

      let options = {}

      if (
        contentType.startsWith('text') ||
        contentType.includes('/json') ||
        contentType.includes('yaml') ||
        contentType.includes('javascript') ||
        contentType.includes('+xml')
      ) {
        options = { encoding: 'utf8' }
      }

      const stream = fs.createReadStream(filename, options)
      res.header('Content-Type', contentType)
      res.header('cache-control', 'no-cache')
      res.header('pragma', 'no-cache')
      stream.pipe(res)
    } catch (err) {
      res.status(500).send()
    }
  }
}
