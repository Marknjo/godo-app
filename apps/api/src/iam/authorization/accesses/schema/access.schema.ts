import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Role } from '../../roles/schema/role.schema'
import { User } from 'src/iam/users/schema/user.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Access {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  accountOwner: User

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  assignedTo: User

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Role',
  })
  roleId: Role

  @Prop({
    default: true,
  })
  isActive: boolean
}

export const AccessSchema = SchemaFactory.createForClass(Access)
export type TAccessDoc = HydratedDocument<Access>
