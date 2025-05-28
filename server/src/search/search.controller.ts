import {
  Param,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Res,
  Session,
  HttpException,
} from '@nestjs/common'
import { Public, User, Private, AuthToken } from '@auth/decorators'
import { ApiOAuth2, ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger'
import { SearchService } from './search.service'

@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller('/api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('query')
  async query(
    @AuthToken() token: string,
    @User() user: any,
    @Query('query') query: string,
    @Query('offset') offaet: number,
    @Query('limit') limit: number,
  ) {
    return await this.searchService.query(token, user, query, offset, limit)
  }

  @Post()
  async search(
    @AuthToken() token: string,
    @User() user: any,
    @Body() query: any,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.searchService.search(token, user, query, offset, limit)
  }
}
