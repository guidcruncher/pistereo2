import { Module } from '@nestjs/common'
import { PushoverService } from './pushover.service'

@Module({
  providers: [PushoverService],
})
export class NotificationModule {}
