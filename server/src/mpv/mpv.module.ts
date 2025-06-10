import { Module } from '@nestjs/common'

import { MpvClientService } from './mpv-client.service'
import { MpvPlayerService } from './mpv-player.service'

@Module({
  providers: [MpvPlayerService, MpvClientService],
  exports: [MpvPlayerService, MpvClientService],
})
export class MpvModule {}
