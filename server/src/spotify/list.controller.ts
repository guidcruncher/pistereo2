import { User } from '@auth/decorators'
import { AuthToken, Private } from '@auth/decorators'
import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOAuth2, ApiOperation } from '@nestjs/swagger'

import { PlaylistImportService } from './playlist-import.service'
import { SpotifyListService } from './spotify-list.service'
import getRawBody = require('raw-body')

@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller('/api/list')
export class ListController {
  constructor(
    private readonly listService: SpotifyListService,
    private readonly playlistImportService: PlaylistImportService,
  ) {}

  @Put('/import')
  @ApiOperation({
    summary: 'Import a M3U playlist into a set of custom stations',
  })
  @ApiConsumes('text/plain')
  @ApiBody({ type: String })
  async importPlaylist(@User() user, @Body() data, @Req() req) {
    let playlist = ''

    if (req.readable) {
      const raw = await getRawBody(req)
      playlist = raw.toString().trim()
    } else {
      playlist = data.trim()
    }

    return await this.playlistImportService.importPlaylist(user, playlist)
  }

  @Get('/spotify/playlists/:uri')
  async getPlaylist(
    @User() user: any,
    @AuthToken() token: string,
    @Param('uri') uri: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getPlaylist(token, uri, offset, limit)
  }

  @Get('/spotify/playlists')
  async getMyPlaylists(
    @User() user: any,
    @AuthToken() token: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getMyPlaylists(token, offset, limit)
  }

  @Get('spotify/albums')
  async getSavedAlbums(
    @User() user: any,
    @AuthToken() token: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getSavedAlbums(token, offset, limit)
  }

  @Get('spotify/episodes')
  async getSavedEpisodes(
    @User() user: any,
    @AuthToken() token: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getSavedEpisodes(token, offset, limit)
  }

  @Get('spotify/shows')
  async getSavedShows(
    @User() user: any,
    @AuthToken() token: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getSavedShows(token, offset, limit)
  }

  @Get('spotify/show/episodes')
  async getShowEpisodes(
    @User() user: any,
    @AuthToken() token: string,
    @Query('uri') uri: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getShowEpisodes(token, user, uri, offset, limit)
  }

  @Get('spotify/tracks')
  async getSavedTracks(
    @User() user: any,
    @AuthToken() token: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.listService.getSavedTracks(token, offset, limit)
  }
}
