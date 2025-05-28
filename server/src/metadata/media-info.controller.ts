import { Res, Controller, Get, Header, Query } from '@nestjs/common'
import { MediaInfoService } from './media-info.service'
import { Public, Private, AuthToken, User } from '@auth/decorators'

@Public()
@Controller('/api/metadata')
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
