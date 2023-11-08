import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { ECategoryStages } from '../enums/e-category-stages.enum'
import { Icon } from 'src/features/icons/schema/icon.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Category {
  @Prop({
    index: 'text',
  })
  title: string

  @Prop()
  description?: string

  @Prop({
    index: true,
  })
  stages: Array<ECategoryStages | string>

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Icon',
  })
  iconsId?: Icon

  @Prop({
    default: true,
    index: true,
  })
  isEnabled: boolean
}

export const CategorySchema = SchemaFactory.createForClass(Category)
export type TCategoryDoc = HydratedDocument<Category>
