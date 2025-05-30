import { User } from '@auth/decorators'
import { Public } from '@auth/decorators'
import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common'
import * as fs from 'fs'
import db from 'mime-db'
import { MimeType } from 'mime-type'
import * as path from 'path'
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger'

@ApiExcludeController()
@Public()
@Controller('*')
export class ClientController {
  private readonly mimeType: MimeType = new MimeType(db)

  constructor() {}

  @Get()
  async clientRequest(@Req() req, @Res() res) {
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
