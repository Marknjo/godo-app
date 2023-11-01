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

          // calculate totalTeamMembers for users & update users
          schema.statics.calcTotalTeamMembers = async function (
            accountOwner: string,
          ) {
            // aggregation
            const stats = await this.aggregate([
              // match
              {
                $match: {
                  accountOwner,
                  $and: [{ isActive: true, isResigned: false }],
                },
              },

              // group
              {
                $group: {
                  _id: '$accountOwner',
                  totalSum: { $sum: 1 },
                },
              },
            ])

            /// updating users schema
            if (stats.length > 0) {
              userService.update(accountOwner, {
                totalTeamMembers: stats[0].totalSum,
              })
            }
          }

          /// calculate totalTeamMembers after creation of new document
          schema.post('save', function () {
            // @ts-expect-error - the method is a custom one
            this.constructor.calcTotalTeamMembers(this.accountOwner)
          })

          /// calculate totalTeamMembers after update of document
          schema.post(/^findOneAnd/, function (doc, next) {
            doc.constructor.calcTotalTeamMembers(doc.accountOwner)

            return next()
          })

          return schema
        },
        // imports: [UsersModule],
        // inject: [UsersService],
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
