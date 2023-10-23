import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class User {
  @Prop({
    maxLength: [50, 'Username must not exceed 50 characters'],
    trim: true,
  })
  username: string

  @Prop({
    maxLength: [100, 'Email must not exceed 100 characters'],
    trim: true,
    unique: true,
  })
  email: string

  @Prop({
    maxLength: [255, 'Password must be less than 255 characters'],
    minLength: [6, 'Password should be greater than 6 character'],
    trim: true,
  })
  password: string

  // @Prop({
  //   type: String,
  //   validate: {
  //     validator: function (value: string) {
  //       return this.password === value
  //     },
  //     message: 'Password do not match',
  //   },
  // })
  // passwordConfirm?: string

  @Prop({
    maxLength: [1000, 'Bio must not exceed 1000 characters'],
    trim: true,
  })
  bio?: string

  @Prop({
    default: true,
  })
  isActive?: boolean

  @Prop({
    default: false,
  })
  isConfirmed?: boolean

  @Prop({
    default: 'default.jpg',
  })
  profileImg?: string

  @Prop()
  passwordResetToken?: Date

  @Prop()
  passwordResetExpiresAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

export type TUserDoc = mongoose.HydratedDocument<User>

/*
 username: string
  email: string
  password: string
  bio: string
  isActive: boolean
  isConfirmed: boolean
  profileImg: string
  passwordResetToken?: Date
  passwordResetExpiresAt?: Date

*/
