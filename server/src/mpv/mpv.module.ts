import { Module } from '@nestjs/common'

import { DataModule } from '../data/data.module'
import { MpvPlayerService } from './mpv-player.service'

@Module({
  imports: [DataModule],
  providers: [MpvPlayerService],
  exports: [MpvPlayerService],
})
export class MpvModule {}
