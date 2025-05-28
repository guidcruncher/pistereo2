import { Module } from '@nestjs/common'
import { MetadataController } from './metadata.controller'
import { MediaInfoService } from './media-info.service'
import { MediaInfoController } from './media-info.controller'

@Module({
  controllers: [MetadataController, MediaInfoController],
  providers: [MediaInfoService],
  exports: [MediaInfoService],
})
export class MetadataModule {}
