import { Module } from '@nestjs/common'
import { MpvPlayerService } from './mpv-player.service'

@Module({
  providers: [MpvPlayerService],
  exports: [MpvPlayerService],
})
export class MpvModule {}
