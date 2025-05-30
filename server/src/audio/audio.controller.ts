import { Channel, Frequency, Mixer } from '@views/index'
import { User } from '@auth/decorators'
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
import { AuthToken, Private, Public } from '@auth/decorators'
import { ApiExcludeController, ApiExcludeEndpoint, ApiOAuth2 } from '@nestjs/swagger'
import { MpvPlayerService } from '../mpv/mpv-player.service'
import { SpotifyPlayerService } from '../spotify/spotify-player.service'
import { TuneinPlayerService } from '../tunein/tunein-player.service'
import { UserStreamPlayerService } from '../userstream/userstream-player.service'
import { PresetService } from './preset.service'
import { PlayableItem, Uri } from '@views/index'
import { AudioService } from './audio.service'
import { EventEmitter2, EventEmitterModule, OnEvent } from '@nestjs/event-emitter'
import { MixerService } from './mixer.service'
import { SettingService } from '@data/setting.service'

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
    private readonly settingService: SettingService,
  ) {}

  @ApiExcludeEndpoint()
  @Public()
  @Get('/p')
  async proxy(@Query('u') url: string, @Res() res) {
    const data = await fetch(url)
    res.header('Content-Type', data.headers.get('Content-Type'))
    return res.send(await data.bytes())
  }

  @Get('/restore/:device')
  async restoreSettings(
    @AuthToken() token: string,
    @User() user: any,
    @Param('device') device: string,
  ) {
    let setting = await this.settingService.getSetting(user.id)

    if (!setting) {
      throw new HttpException('No settings available', 404)
    }

    await this.audioService.changeVolume(user, token, setting.volume ?? 50)

    if (setting.mixer) {
      await this.mixerService.updateMixer(device, setting.mixer)
    }

    return {}
  }

  @Get('/presets')
  async getPresets(@User() user: any, @AuthToken() token: string) {
    return await this.presetService.getPresets(token, user)
  }

  @Get('/queue')
  async getPlaybackQueue(@User() user: any, @AuthToken() token: string) {
    return await this.spotifyPlayerService.getPlaybackQueue(token)
  }

  @Put('/presets')
  async addPresets(@User() user: any, @AuthToken() token: string, @Query('uri') uri: string) {
    const metadata = await this.audioService.getTrackDetail(token, uri)
    metadata.uri = Uri.fromUriString(uri)
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
    await this.settingService.updateVolume(user.id, volume)
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
  async updateMixer(@AuthToken() token, @User() user: any, @Param('device') device: string, @Body() mixer: Mixer) {
    await this.settingService.updateMixer(user.id, mixer)
    return await this.mixerService.updateMixer(device, mixer)
  }
}
