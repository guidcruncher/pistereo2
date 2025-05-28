import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema()
export class User {
  @Prop({ index: true })
  userId: string

  @Prop()
  uri: string

  @Prop()
  email: string

  @Prop()
  name: string

  @Prop()
  imageUrl: string

  @Prop()
  country: string
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)
