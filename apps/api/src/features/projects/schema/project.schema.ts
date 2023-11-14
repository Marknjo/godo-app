import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { EProjectStages } from '../enums/e-project-stages.enum'
import { Icon } from 'src/features/icons/schema/icon.schema'
import { Todo } from 'src/features/todos/schema/todo.schema'
import { EProjectTypes } from '../enums/e-project-types.enum'
import { EProjectTypeBehavior } from '../enums/e-project-type-behavior.enum'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Project {
  @Prop({
    unique: true,
  })
  title: string

  @Prop()
  description?: string

  @Prop({
    index: true,
  })
  stages: Array<EProjectStages | string>

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

  @Prop({
    default: 0,
  })
  totalSubProjects: number

  @Prop({
    default: 0,
  })
  totalProjectTodos: number

  @Prop({
    index: true,
    default: EProjectStages.BACKLOG,
  })
  progressStage: EProjectStages | string

  @Prop({
    type: String,
    enum: {
      values: [...Object.values(EProjectTypes)],
      message: `Received {VALUE}, while expects project to be ${Object.values(
        EProjectTypes,
      ).join(' or ')}`,
    },
    default: EProjectTypes.ROOT,
  })
  projectType: EProjectTypes

  @Prop({
    type: String,
    enum: {
      values: [...Object.values(EProjectTypeBehavior)],
      message: `Received {VALUE}, while expects project to be ${Object.values(
        EProjectTypeBehavior,
      ).join(' or ')}`,
    },
    default: EProjectTypeBehavior.NORMAL,
  })
  projectTypeBehavior?: EProjectTypeBehavior

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Project',
  })
  rootParentId?: Project

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Project',
  })
  dependsOn?: Project

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Project',
  })
  subParentId?: Project

  @Prop()
  startAt?: Date

  @Prop()
  endAt?: Date
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
export type TProjectDoc = HydratedDocument<Project>

ProjectSchema.virtual('tasks', {
  foreignField: 'projectId',
  localField: '_id',
  ref: 'Todo',
  count: true,
})
