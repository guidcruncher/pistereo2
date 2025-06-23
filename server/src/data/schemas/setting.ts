import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaFactory } from '@nestjs/mongoose'
import { Mixer } from '@views/index'
import { HydratedDocument } from 'mongoose'

@Schema()
export class Setting {
  @Prop({ index: true })
  userId: string

  @Prop()
  volume: number

  @Prop({ type: Object })
  mixer: Mixer

  @Prop({ type: Object })
  flags: Record<string, any>
}

export type SettingDocument = HydratedDocument<Setting>
export const SettingSchema = SchemaFactory.createForClass(Setting)
