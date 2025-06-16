import { Module } from '@nestjs/common'

import { HistoryService } from './history.service'
import { MongoConnectionService } from './mongo-connection.service'
import { PresetsService } from './presets.service'
import { SettingService } from './setting.service'
import { UserService } from './user.service'
import { UserStreamService } from './userstream.service'
import { MediaServerService } from './media-server.service'

@Module({
  imports: [MongoConnectionService.setup(), MongoConnectionService.getSchemas()],
  providers: [
    MongoConnectionService,
    PresetsService,
    UserStreamService,
    HistoryService,
    UserService,
    SettingService,
    MediaServerService,
  ],
  exports: [
    PresetsService,
    UserStreamService,
    HistoryService,
    UserService,
    SettingService,
    MediaServerService,
  ],
  controllers: [],
})
export class DataModule {}
