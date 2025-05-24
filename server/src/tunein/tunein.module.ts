import { Module } from '@nestjs/common'
import { DataModule } from '../data/data.module'
import { CoreModule } from '../core/core.module'
import { AuthModule } from '../auth/auth.module'
import { MpvModule } from '../mpv/mpv.module'
import { TuneinPlayerService } from './tunein-player.service'

@Module({
  imports: [DataModule, AuthModule, CoreModule, MpvModule],
  controllers: [],
  providers: [TuneinPlayerService],
  exports: [TuneinPlayerService],
})
export class TuneinModule {}
