import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { EProjectStages } from 'src/features/projects/enums/e-project-stages.enum'
import { Project } from 'src/features/projects/schema/project.schema'
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
  progressStage?: string | EProjectStages

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
    ref: 'Project',
  })
  ProjectId?: Project

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Project',
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
// ProjectId?: Project
// iconId?: Icon
// isEnabled: boolean
