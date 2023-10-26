import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { Role, RolesSchema } from './schema/role.schema'
import { FactoryUtils } from 'src/common/services/factory.utils'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: () => {
          const schema = RolesSchema

          // schema.pre(/^find/, function (next) {
          //   // @ts-expect-error populate is available in this
          //   this.populate<{ assignedFor: Role }>({
          //     path: 'assignedFor',
          //     select: 'id name isValid',
          //   })

          //   return next()
          // })

          return schema
        },
      },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, FactoryUtils],
})
export class RolesModule {}
