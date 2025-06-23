import { Module } from '@nestjs/common'

import { MediaInfoController } from './media-info.controller'
import { MediaInfoService } from './media-info.service'
import { MetadataController } from './metadata.controller'

@Module({
  controllers: [MetadataController, MediaInfoController],
  providers: [MediaInfoService],
  exports: [MediaInfoService],
})
export class MetadataModule {}
