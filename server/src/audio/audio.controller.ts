import { Channel, Mixer, Frequency } from '@views/index'
import { User } from '@auth/decorators'
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
import { Public, Private, AuthToken } from '@auth/decorators'
import { ApiOAuth2, ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger'
import { MpvPlayerService } from '../mpv/mpv-player.service'
import { SpotifyPlayerService } from '../spotify/spotify-player.service'
import { TuneinPlayerService } from '../tunein/tunein-player.service'
import { UserStreamPlayerService } from '../userstream/userstream-player.service'
import { PresetService } from './preset.service'
import { PlayableItem, Uri } from '@views/index'
import { AudioService } from './audio.service'
import { OnEvent, EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import { MixerService } from './mixer.service'

@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller('/api')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly presetService: PresetService,
    private readonly spotifyPlayerService: SpotifyPlayerService,
    private readonly mixerService: MixerService,
  ) {}

  @ApiExcludeEndpoint()
  @Public()
  @Get('/p')
  async proxy(@Query('u') url: string, @Res() res) {
    const data = await fetch(url)
    res.header('Content-Type', data.headers.get('Content-Type'))
    return res.send(await data.bytes())
  }

  @Get('/presets')
  async getPresets(@User() user: any, @AuthToken() token: string) {
    return await this.presetService.getPresets(token, user)
  }

  @Put('/presets')
  async addPresets(@User() user: any, @AuthToken() token: string, @Query('uri') uri: string) {
    let metadata = await this.audioService.getTrackDetail(token, uri)
    return await this.presetService.addPreset(token, user, metadata)
  }

  @Put('/lastplayed')
  async startLastPlayed(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.startLastPlayed(token, user)
  }

  @Put('/play')
  async playMedia(@User() user: any, @AuthToken() token: string, @Query('uri') uri: string) {
    return await this.audioService.playMedia(user, token, uri)
  }

  @Put('/volume')
  async changeVolume(
    @User() user: any,
    @AuthToken() token: string,
    @Query('volume') volume: number,
  ) {
    return await this.audioService.changeVolume(user, token, volume)
  }

  @Get()
  async getStatus(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.getStatus(user, token)
  }

  @Get('/volume')
  async getVolume(@AuthToken() token: string) {
    return await this.audioService.getVolume(token)
  }

  @Put('/toggleplayback')
  async togglePlayback(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.togglePlayback(user, token)
  }

  @Put('/stop')
  async stopPlayback(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.stopPlayback(user, token)
  }

  @Put('/next')
  async nextTrack(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.nextTrack(user, token)
  }

  @Put('/previous')
  async previousTrack(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.previousTrack(user, token)
  }

  @Get('/metadata/track')
  async getTrackDetail(@AuthToken() token: string, @Query('uri') uri: string) {
    return await this.audioService.getTrackDetail(token, uri)
  }

  @Get('/mixer/:device')
  async getMixer(@AuthToken() token, @Param('device') device: string) {
    return await this.mixerService.getMixer(device)
  }

  @Post('/mixer/:device')
  async updateMixer(@AuthToken() token, @Param('device') device: string, @Body() mixer: Mixer) {
    return await this.mixerService.updateMixer(device, mixer)
  }
}
