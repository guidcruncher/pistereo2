import { Module } from '@nestjs/common'

import { DataModule } from '../data/data.module'
import { MpvClientService } from './mpv-client.service'
import { MpvPlayerService } from './mpv-player.service'

@Module({
  imports: [ DataModule ],
  providers: [MpvPlayerService, MpvClientService],
  exports: [MpvPlayerService, MpvClientService],
})
export class MpvModule {}
