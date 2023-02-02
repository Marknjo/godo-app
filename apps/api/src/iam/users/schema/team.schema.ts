import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.schema'
import { HydratedDocument, SchemaTypes } from 'mongoose'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Team {
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
  memberId: User

  @Prop()
  description: string

  @Prop({
    default: true,
    index: true,
  })
  isActive?: boolean

  @Prop({
    default: false,
    index: true,
  })
  isResigned?: boolean

  @Prop()
  resignationReason?: string
}

export const TeamSchema = SchemaFactory.createForClass(Team)
export type TTeamDoc = HydratedDocument<Team>
