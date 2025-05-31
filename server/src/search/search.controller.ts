import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Res,
  Session,
} from '@nestjs/common'
import { AuthToken, Private, Public, User } from '@auth/decorators'
import { ApiExcludeController, ApiExcludeEndpoint, ApiOAuth2 } from '@nestjs/swagger'
import { SearchService } from './search.service'

@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller('/api/search')
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
    return await this.searchService.query(token, user, source.toLowerCase(), query, offset, limit)
  }
}
