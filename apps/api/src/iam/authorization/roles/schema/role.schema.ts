import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ERoleTypes } from '../enums/e-role-types'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { ERoles } from 'src/iam/enums/e-roles.enum'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Role {
  @Prop({
    index: 'text',
    unique: true,
  })
  name: ERoles

  @Prop()
  description: string

  @Prop({ default: true, index: true })
  isEnabled?: boolean

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Role',
  })
  assignedFor?: Role

  @Prop({
    enum: {
      values: Object.values(ERoleTypes),
      message: `Saw {VALUE} but expects role type to be either ${Object.values(
        ERoleTypes,
      ).join(' or ')}`,
    },
  })
  type: ERoleTypes
}

export const RolesSchema = SchemaFactory.createForClass(Role)
export type TRolesDoc = HydratedDocument<Role>
