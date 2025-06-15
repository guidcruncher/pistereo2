import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema()
export class MediaServer {
  @Prop()
  ipAddress: string

  @Prop()
  apiUrl: string

  @Prop()
  hostname: string

  @Prop()
  id: string

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  lastHeartbeat: Date

  @Prop({ type: Date, default: new Date().setDate(new Date().getDate() + 1), expires: 10 })
  expiresAt: Date
}

export type MediaServerDocument = HydratedDocument<MediaServer>
export const MediaServerSchema = SchemaFactory.createForClass(MediaServer)
