import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { DataModule } from '../data/data.module'
import { MetadataModule } from '../metadata/metadata.module'
import { MpvModule } from '../mpv/mpv.module'
import { LibrespotPlayerService } from './librespot-player.service'
import { ListController } from './list.controller'
import { PlayerController } from './player.controller'
import { PlaylistImportService } from './playlist-import.service'
import { SpotifyListService } from './spotify-list.service'

@Module({
  imports: [DataModule, AuthModule, CoreModule, MetadataModule, MpvModule],
  controllers: [PlayerController, ListController],
  providers: [SpotifyListService, PlaylistImportService, LibrespotPlayerService],
  exports: [SpotifyListService, LibrespotPlayerService],
})
export class SpotifyModule {}
