import { User } from '@auth/decorators'
import { AuthToken, Private, Public } from '@auth/decorators'
import { SettingService } from '@data/setting.service'
import { Body, Controller, Get, HttpException, Param, Post, Put, Query, Res } from '@nestjs/common'
import { ApiBody, ApiExcludeEndpoint, ApiOAuth2 } from '@nestjs/swagger'
import { Frequency, Mixer } from '@views/index'
import { Uri } from '@views/index'

import { SpotifyPlayerService } from '../spotify/spotify-player.service'
import { AudioService } from './audio.service'
import { MixerService } from './mixer.service'
import { PresetService } from './preset.service'
import { TtsService } from './tts.service'

@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state', 'user-read-recently-played'],
  'Api',
)
@Private()
@Controller()
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly presetService: PresetService,
    private readonly spotifyPlayerService: SpotifyPlayerService,
    private readonly mixerService: MixerService,
    private readonly settingService: SettingService,
    private readonly ttsService: TtsService,
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
    const setting = await this.settingService.getSetting(user.id)

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

  @Get('/nowplaying')
  async getNowPlaying(@AuthToken() token: string) {
    return await this.audioService.getNowPlaying()
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

  @Put('play')
  async playMedia(@User() user: any, @AuthToken() token: string, @Query('uri') uri: string) {
    return await this.audioService.playMedia(user, token, uri)
  }

  @Put('/playfile')
  async playFile(
    @User() user: any,
    @AuthToken() token: string,
    @Query('file') filename: string,
    @Query('resume') resume = true,
  ) {
    return await this.audioService.playFiles([filename], resume)
  }

  @Put('/playfiles')
  async playFiles(
    @User() user: any,
    @AuthToken() token: string,
    @Body() data: any,
    @Query('resume') resume = true,
  ) {
    return await this.audioService.playFiles(data.filenames, resume)
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

  @Get('/status')
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

  @Put('/pause')
  async pause(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.pause(user, token)
  }

  @Put('/resume')
  async resume(@User() user: any, @AuthToken() token: string) {
    return await this.audioService.resume(user, token)
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

  @Post('/mixer/:device/reset')
  async resetMixer(@AuthToken() token, @User() user: any, @Param('device') device: string) {
    const mixer = await this.mixerService.resetMixer(
      device,
      parseInt(process.env.PISTEREO_EQ_RESET as string),
    )
    await this.settingService.updateMixer(user.id, mixer)
    return mixer
  }

  @Post('/mixer/:device')
  async updateMixer(
    @AuthToken() token,
    @User() user: any,
    @Param('device') device: string,
    @Body() mixer: Mixer,
  ) {
    await this.settingService.updateMixer(user.id, mixer)
    return await this.mixerService.updateMixer(device, mixer)
  }

  @Post('/mixer/:device/channel/:index')
  async updateMixerChannel(
    @AuthToken() token,
    @User() user: any,
    @Param('device') device: string,
    @Param('index') index: number,
    @Body() item: Frequency,
  ) {
    let mixer = await this.mixerService.getMixer(device)
    mixer[index] = item
    await this.settingService.updateMixer(user.id, mixer)
    return await this.mixerService.updateMixer(device, mixer)
  }

  @Post('/tts/:language')
  @ApiBody({ type: Object })
  async textToSpeech(
    @AuthToken() token,
    @User() user: any,
    @Body() data: any,
    @Param('language') language: string,
  ) {
    const text = (data.text ?? '').trim()

    if (text == '') {
      throw new HttpException('No text specified', 400)
    }

    await this.ttsService.say(text, language, false)
  }
}
