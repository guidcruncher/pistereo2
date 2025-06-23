import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { DataModule } from '../data/data.module'
import { MpvModule } from '../mpv/mpv.module'
import { UserStreamPlayerService } from './userstream-player.service'

@Module({
  imports: [DataModule, AuthModule, CoreModule, MpvModule],
  controllers: [],
  providers: [UserStreamPlayerService],
  exports: [UserStreamPlayerService],
})
export class UserstreamModule {}
