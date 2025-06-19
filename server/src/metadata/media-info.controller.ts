import { Public } from '@auth/decorators'
import { Controller, Get, Header, Query, Res } from '@nestjs/common'

import { MediaInfoService } from './media-info.service'

@Public()
@Controller('/metadata')
export class MediaInfoController {
  constructor(private readonly metadataService: MediaInfoService) {}

  @Get('/icon')
  @Header('content-type', 'image/webp')
  public async getStationIcon(@Query('query') query: string, @Res() res) {
    return await this.metadataService.getMediaIcon(query, res)
  }

  @Get('/icon/url')
  public async getStationIconUrl(@Query('query') query: string) {
    return await this.metadataService.getMediaIconUrl(query)
  }
}
