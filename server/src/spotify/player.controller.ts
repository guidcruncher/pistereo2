import { User } from '@auth/decorators'
import { AuthToken, Private } from '@auth/decorators'
import { Controller, Delete, Get, HttpException, Param, Put, Query } from '@nestjs/common'
import { ApiExcludeController, ApiOAuth2 } from '@nestjs/swagger'
import { Uri } from '@views/uri'

import { LibrespotPlayerService } from '../spotify/librespot-player.service'

@ApiExcludeController()
@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller('/api/spotify/player')
export class PlayerController {
  constructor(
    //   private readonly playerService: SpotifyPlayerService
    private readonly playerService: LibrespotPlayerService,
  ) {}

  @Get('status')
  async getStatus(@User() user: any, @AuthToken() token: string) {
    return await this.playerService.getStatus(token)
  }

  @Put(':deviceid/play')
  async play(
    @User() user: any,
    @AuthToken() token: string,
    @Param('deviceid') deviceid: string,
    @Query('uri') uri: string,
  ) {
    return await this.playerService.play(token, deviceid, Uri.fromUriString(uri))
  }

  @Put(':deviceid/control/volume')
  async setVolume(
    @User() user: any,
    @AuthToken() token: string,
    @Param('deviceid') deviceid: string,
    @Query('volume') volume: number,
  ) {
    if (volume < 0 || volume > 100) {
      throw new HttpException('Volume outside permitted range', 400)
    }

    return await this.playerService.setVolume(token, deviceid, volume)
  }

  @Put(':deviceid/control/:command')
  async playerCommand(
    @User() user: any,
    @AuthToken() token: string,
    @Param('deviceid') deviceid: string,
    @Param('command') command: string,
  ) {
    if (!['play', 'resume', 'previous', 'next', 'stop', 'pause'].includes(command)) {
      throw new HttpException(`Invalid command ${command}`, 400)
    }

    return await this.playerService.playerCommand(token, deviceid, command)
  }

  @Get('devices')
  async getDevices(@User() user: any, @AuthToken() token: string) {
    return await this.playerService.getDevices(token)
  }

  @Get('queue')
  async getPlaybackQueue(@User() user: any, @AuthToken() token: string) {
    return await this.playerService.getPlaybackQueue(token)
  }

  @Put()
  async connect(@User() user: any, @AuthToken() token: string, @Query('device') device: string) {
    let name = ''

    switch (device) {
      case 'local':
        name = process.env.PISTEREO_LOCALDEVICE as string
        break
      case 'remote':
        name = process.env.PISTEREO_REMOTEDEVICE as string
        break
      default:
        throw new HttpException('Invalid device type', 400)
    }

    return await this.playerService.connect(token, name)
  }

  @Delete(':deviceid')
  async disconnect(
    @User() user: any,
    @AuthToken() token: string,
    @Param('deviceid') deviceid: string,
  ) {
    return await this.playerService.disconnect(token, deviceid)
  }
}
