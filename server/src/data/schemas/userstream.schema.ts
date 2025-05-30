import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Uri } from '@views/uri'
import { Context } from '@views/context'
import { PlayableItem } from '@views/playableitem'

@Schema()
export class UserStream implements PlayableItem {
  @Prop({ index: true })
  userId: string

  @Prop({ index: true })
  id: string

  @Prop({ type: Object })
  context: Context

  @Prop()
  owner: string

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
}

export type UserStreamDocument = HydratedDocument<UserStream>
export const UserStreamSchema = SchemaFactory.createForClass(UserStream)
UserStreamSchema.index({ name: 'text' })
