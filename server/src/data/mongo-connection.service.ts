import { Logger } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { ClientSession, Connection } from 'mongoose'
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
    ])
  }
}
