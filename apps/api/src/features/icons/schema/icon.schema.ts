import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Icon {
  @Prop({
    unique: true,
  })
  slug: string

  @Prop({
    index: 'text',
  })
  prettyName: string

  @Prop()
  description?: string

  @Prop({
    default: true,
    index: true,
  })
  isEnabled?: boolean
}

export const IconSchema = SchemaFactory.createForClass(Icon)
export type TIconDoc = HydratedDocument<Icon>

//  slug: string
//  prettyName: string
//  description?: string
