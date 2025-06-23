import { AuthToken, Private, User } from '@auth/decorators'
import { Controller, Get, HttpException, Param, Query } from '@nestjs/common'
import { ApiOAuth2 } from '@nestjs/swagger'

import { SearchService } from './search.service'

@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/:source')
  async query(
    @AuthToken() token: string,
    @User() user: any,
    @Param('source') source: string,
    @Query('query') query: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    if (query == '') {
      throw new HttpException('No query', 400)
    }

    return await this.searchService.query(token, user, source.toLowerCase(), query, offset, limit)
  }
}
