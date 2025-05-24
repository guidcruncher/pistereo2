import { Module } from '@nestjs/common'
import { UserStreamPlayerService } from './userstream-player.service'
import { DataModule } from '../data/data.module'
import { CoreModule } from '../core/core.module'
import { AuthModule } from '../auth/auth.module'
import { MpvModule } from '../mpv/mpv.module'

@Module({
  imports: [DataModule, AuthModule, CoreModule, MpvModule],
  controllers: [],
  providers: [UserStreamPlayerService],
  exports: [UserStreamPlayerService],
})
export class UserstreamModule {}
