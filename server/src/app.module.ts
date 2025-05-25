import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { SpotifyModule } from './spotify/spotify.module'
import { ClientModule } from './client/client.module'
import { ClientMiddleware } from './client/client.middleware'
import { HttpTransportService } from './core/http-transport.service'
import { CoreModule } from './core/core.module'
import { DataModule } from './data/data.module'
import { TuneinModule } from './tunein/tunein.module'
import { MpvModule } from './mpv/mpv.module'
import { UserstreamModule } from './userstream/userstream.module'
import { AudioModule } from './audio/audio.module'
import { MetadataModule } from './metadata/metadata.module'
import { AllExceptionFilter } from './exception.filter'
import pino from 'pino'
import { LoggerModule, Logger } from 'nestjs-pino'

@Module({
  imports: [
    LoggerModule.forRoot(),
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
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: (logger: Logger) => {
        return new AllExceptionFilter(logger)
      },
      inject: [Logger],
    },
    AppService,
  ],
})
export class AppModule {}
