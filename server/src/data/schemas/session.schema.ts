import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Profile } from '@views/profile'

@Schema()
export class Session {
  @Prop({ index: true })
  authToken: string

  @Prop()
  refreshToken: string

  @Prop({ type: Object })
  user: Profile

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: new Date().setHours(new Date().getHours() + 2), expires: 10 })
  expiresAt: Date
}

export type SessionDocument = HydratedDocument<Session>
export const SessionSchema = SchemaFactory.createForClass(Session)
