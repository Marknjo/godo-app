import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schema/user.schema'
import { HashingService } from '../authentication/bcrypt/hashing.service'
import { BcryptService } from '../authentication/bcrypt/bcrypt.service'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema

          // hooks
          // schema.pre('save', function (next) {
          //   if (!this.isNew && this.isModified()) return next()

          //   this.password = this.passwordConfirm
          //   this.passwordConfirm = undefined

          //   return next()
          // })

          return schema
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
  ],
})
export class UsersModule {}
