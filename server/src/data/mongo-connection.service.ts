import { Injectable } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

import * as schemas from './schemas/index'

const mongoose = require('mongoose')

@Injectable()
export class MongoConnectionService {
  constructor(@InjectConnection() private connection: Connection) {}

  public static setupWithParam(uri: string, dbName: string) {
    return MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.PISTEREO_MONGO_URL as string,
        dbName:
          (process.env.PISTEREO_MONGO_DB as string) == ''
            ? 'pistereo2'
            : (process.env.PISTEREO_MONGO_DB as string),
      }),
    })
  }

  public static setup() {
    return MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.PISTEREO_MONGO_URL as string,
        dbName:
          (process.env.PISTEREO_MONGO_DB as string) == ''
            ? 'pistereo2'
            : (process.env.PISTEREO_MONGO_DB as string),
      }),
    })
  }

  public static getSchemas() {
    return MongooseModule.forFeature([
      { name: 'Preset', schema: schemas.PresetSchema },
      { name: 'UserStream', schema: schemas.UserStreamSchema },
      { name: 'History', schema: schemas.HistorySchema },
      { name: 'LastPlayed', schema: schemas.LastPlayedSchema },
      { name: 'Session', schema: schemas.SessionSchema },
      { name: 'User', schema: schemas.UserSchema },
      { name: 'Setting', schema: schemas.SettingSchema },
      { name: 'MediaServer', schema: schemas.MediaServerSchema },
    ])
  }
}
