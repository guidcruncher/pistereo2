import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { AppService } from './app.service'
import { AudioModule } from './audio/audio.module'
import { AuthModule } from './auth/auth.module'
import { ClientModule } from './client/client.module'
import { CoreModule } from './core/core.module'
import { DataModule } from './data/data.module'
import { AllExceptionFilter } from './exception.filter'
import { MetadataModule } from './metadata/metadata.module'
import { MpvModule } from './mpv/mpv.module'
import { SearchModule } from './search/search.module'
import { SpotifyModule } from './spotify/spotify.module'
import { TuneinModule } from './tunein/tunein.module'
import { UserstreamModule } from './userstream/userstream.module'
import { AppController } from './app.controller'

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    DataModule,
    AuthModule,
    CoreModule,
    SpotifyModule,
    ClientModule,
    TuneinModule,
    MpvModule,
    UserstreamModule,
    AudioModule,
    MetadataModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
