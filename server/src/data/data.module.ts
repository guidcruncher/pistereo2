import { Module } from '@nestjs/common'

import { HistoryService } from './history.service'
import { MongoConnectionService } from './mongo-connection.service'
import { PresetsService } from './presets.service'
import { SettingService } from './setting.service'
import { UserService } from './user.service'
import { UserStreamService } from './userstream.service'

@Module({
  imports: [MongoConnectionService.setup(), MongoConnectionService.getSchemas()],
  providers: [
    MongoConnectionService,
    PresetsService,
    UserStreamService,
    HistoryService,
    UserService,
    SettingService,
  ],
  exports: [PresetsService, UserStreamService, HistoryService, UserService, SettingService],
  controllers: [],
})
export class DataModule {}
