import { Module } from '@nestjs/common'
import { PlayerController } from './player.controller'
import { SpotifyPlayerService } from './spotify-player.service'
import { SpotifyListService } from './spotify-list.service'
import { ListController } from './list.controller'
import { DataModule } from '../data/data.module'
import { CoreModule } from '../core/core.module'
import { AuthModule } from '../auth/auth.module'
import { LibrespotClientService } from './librespot-client.service'
import { PlaylistImportService } from './playlist-import.service'
import { MetadataModule } from '../metadata/metadata.module'
import { WebsocketsController } from './websockets.controller'
import { MpvModule } from '../mpv/mpv.module'
import { LibrespotPlayerService } from './librespot-player.service'

@Module({
  imports: [DataModule, AuthModule, CoreModule, MetadataModule, MpvModule],
  controllers: [PlayerController, ListController, WebsocketsController],
  providers: [
    SpotifyPlayerService,
    SpotifyListService,
    LibrespotClientService,
    PlaylistImportService,
    LibrespotPlayerService,
  ],
  exports: [
    SpotifyPlayerService,
    SpotifyListService,
    LibrespotClientService,
    LibrespotPlayerService,
  ],
})
export class SpotifyModule {}
