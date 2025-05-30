import { Module } from '@nestjs/common'
import { PresetsService } from './presets.service'
import { UserStreamService } from './userstream.service'
import { MongoConnectionService } from './mongo-connection.service'
import { HistoryService } from './history.service'
import { UserService } from './user.service'
import { SettingService } from './setting.service'

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
