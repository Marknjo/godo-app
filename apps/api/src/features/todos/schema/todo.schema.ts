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
  projectId?: Project

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Project',
  })
  iconId?: Icon

  @Prop({
    default: true,
  })
  isEnabled: boolean

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Todo',
  })
  dependsOn?: Todo
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
export type TTodoDoc = HydratedDocument<Todo>

// title: string
// description?: string
// progressStage?: string
// startAt?: Date
// endAt?: Date
// userId: User
// projectId?: Project
// iconId?: Icon
// isEnabled: boolean

// relationship sub-todos of a give todo
TodoSchema.virtual('parentTodos', {
  localField: '_id',
  foreignField: 'subTodo',
  ref: 'SubTodo',
})
