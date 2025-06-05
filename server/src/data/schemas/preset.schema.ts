import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { Context } from '@views/context'
import { PlayableItem } from '@views/playableitem'
import { Uri } from '@views/uri'
import { HydratedDocument } from 'mongoose'

@Schema()
export class Preset implements PlayableItem {
  @Prop({ index: true })
  userId: string

  @Prop({ index: true })
  presetid: string

  @Prop({ index: true })
  id: string

  @Prop({ type: Object })
  context: Context

  @Prop({ type: Object })
  uri: Uri

  @Prop()
  owner: string

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

export type PresetDocument = HydratedDocument<Preset>
export const PresetSchema = SchemaFactory.createForClass(Preset)
