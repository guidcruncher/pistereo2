import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AuthModule } from '../auth/auth.module'
import { SpotifyModule } from '../spotify/spotify.module'
import { HttpTransportService } from '../core/http-transport.service'
import { CoreModule } from '../core/core.module'
import { DataModule } from '../data/data.module'
import { TuneinModule } from '../tunein/tunein.module'
import { MpvModule } from '../mpv/mpv.module'
import { UserstreamModule } from '../userstream/userstream.module'

import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { TuneinSearchService } from './tunein-search.service'

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
  controllers: [SearchController],
  providers: [SearchService, TuneinSearchService],
})
export class SearchModule {}
