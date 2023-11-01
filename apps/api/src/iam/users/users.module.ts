import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FactoryUtils } from 'src/common/services/factory.utils'

import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User, UserSchema } from './schema/user.schema'
import { HashingService } from '../authentication/bcrypt/hashing.service'
import { BcryptService } from '../authentication/bcrypt/bcrypt.service'
import { TeamsController } from './teams/teams.controller'
import { TeamsService } from './teams/teams.service'
import { Team, TeamSchema } from './schema/team.schema'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema

          return schema
        },
      },
      {
        name: Team.name,
        useFactory: (userService: UsersService) => {
          const schema = TeamSchema

          return schema
        },
      },
    ]),
  ],
  controllers: [UsersController, TeamsController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    TeamsService,
    FactoryUtils,
  ],
  exports: [UsersService, TeamsService],
})
export class UsersModule {}
