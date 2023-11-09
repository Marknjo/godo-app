import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { ECategoryStages } from 'src/features/categories/enums/e-category-stages.enum'
import { Category } from 'src/features/categories/schema/category.schema'
import { Icon } from 'src/features/icons/schema/icon.schema'
import { User } from 'src/iam/users/schema/user.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Todo {
  @Prop()
  title: string

  @Prop()
  description?: string

  @Prop()
  progressStage?: string | ECategoryStages

  @Prop()
  startAt?: Date

  @Prop()
  endAt?: Date

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  userId: User

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Category',
  })
  categoryId?: Category

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Category',
  })
  iconId?: Icon

  @Prop({
    default: true,
  })
  isEnabled: boolean
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
export type TTodoDoc = HydratedDocument<Todo>

// title: string
// description?: string
// progressStage?: string
// startAt?: Date
// endAt?: Date
// userId: User
// categoryId?: Category
// iconId?: Icon
// isEnabled: boolean
