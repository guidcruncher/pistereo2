import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AuthModule } from '../auth/auth.module'
import { SpotifyModule } from '../spotify/spotify.module'
import { ClientModule } from '../client/client.module'
import { ClientMiddleware } from '../client/client.middleware'
import { HttpTransportService } from '../core/http-transport.service'
import { CoreModule } from '../core/core.module'
import { DataModule } from '../data/data.module'
import { TuneinModule } from '../tunein/tunein.module'
import { MpvModule } from '../mpv/mpv.module'
import { UserstreamModule } from '../userstream/userstream.module'

import { AudioController } from './audio.controller'
import { AudioService } from './audio.service'
import { PresetService } from './preset.service'
import { UserStreamService } from './user-stream.service'
import { WebsocketsController } from './websockets.controller'
import { MixerService } from './mixer.service'

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
  providers: [AudioService, PresetService, UserStreamService, MixerService],
  controllers: [AudioController, WebsocketsController],
})
export class AudioModule {}
