import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { DataModule } from '../data/data.module'
import { MpvModule } from '../mpv/mpv.module'
import { SpotifyModule } from '../spotify/spotify.module'
import { TuneinModule } from '../tunein/tunein.module'
import { UserstreamModule } from '../userstream/userstream.module'
import { AudioController } from './audio.controller'
import { AudioService } from './audio.service'
import { MixerService } from './mixer.service'
import { PresetService } from './preset.service'
import { TtsService } from './tts.service'
import { UserStreamService } from './user-stream.service'
import { WebsocketsController } from './websockets.controller'

@Module({
  imports: [
    DataModule,
    AuthModule,
    CoreModule,
    SpotifyModule,
    TuneinModule,
    MpvModule,
    UserstreamModule,
  ],
  providers: [AudioService, PresetService, UserStreamService, MixerService, TtsService],
  controllers: [AudioController, WebsocketsController],
})
export class AudioModule {}
