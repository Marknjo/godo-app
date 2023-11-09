import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { EProjectStages } from '../enums/e-project-stages.enum'
import { Icon } from 'src/features/icons/schema/icon.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Project {
  @Prop({
    index: 'text',
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
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
export type TProjectDoc = HydratedDocument<Project>
