import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { Context } from '@views/context'
import { PlayableItem } from '@views/playableitem'
import { Uri } from '@views/uri'
import { HydratedDocument } from 'mongoose'

@Schema()
export class History implements PlayableItem {
  @Prop({ index: true })
  historyid: string

  @Prop({ index: true })
  userId: string

  @Prop({ index: true })
  source: string

  @Prop()
  timestamp: number

  @Prop()
  id: string

  @Prop()
  owner: string

  @Prop({ type: Object })
  context: Context

  @Prop({ type: Object })
  uri: Uri

  @Prop()
  url: string

  @Prop()
  name: string

  @Prop()
  subtitle: string

  @Prop()
  description: string

  @Prop()
  artists: string[]

  @Prop()
  imageUrl: string

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: new Date().setDate(new Date().getDate() + 14), expires: 10 })
  expiresAt: Date
}

export type HistoryDocument = HydratedDocument<History>
export const HistorySchema = SchemaFactory.createForClass(History)
