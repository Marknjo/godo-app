import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FactoryUtils } from 'src/common/services/factory.utils'
import { UsersModule } from 'src/iam/users/users.module'

import { AccessesService } from './accesses.service'
import { AccessesController } from './accesses.controller'
import { RolesModule } from '../roles/roles.module'
import { Access, AccessSchema } from './schema/access.schema'

@Module({
  imports: [
    RolesModule,
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Access.name,
        useFactory: () => {
          const schema = AccessSchema

          return schema
        },
      },
    ]),
  ],
  controllers: [AccessesController],
  providers: [AccessesService, FactoryUtils],
  exports: [AccessesService],
})
export class AccessesModule {}
