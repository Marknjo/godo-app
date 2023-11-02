import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Role } from '../../roles/schema/role.schema'
import { User } from 'src/iam/users/schema/user.schema'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'

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
  isEnabled: boolean

  @Prop({
    type: String,
    enum: {
      values: [...Object.values(EPremiumSubscribers)],
      message: `Invalid role {VALUE}, expects ${Object.values(
        EPremiumSubscribers,
      ).join(' or ')}`,
    },
  })
  baseRole: EPremiumSubscribers
}

export const AccessSchema = SchemaFactory.createForClass(Access)
export type TAccessDoc = HydratedDocument<Access>
