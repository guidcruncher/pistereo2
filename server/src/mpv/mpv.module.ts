import { Module } from '@nestjs/common'

import { MpvPlayerService } from './mpv-player.service'
import { MpvClientService } from './mpv-client.service'

@Module({
  providers: [MpvPlayerService, MpvClientService],
  exports: [MpvPlayerService, MpvClientService ],
})
export class MpvModule {}
