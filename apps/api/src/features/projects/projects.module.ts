import { Module } from '@nestjs/common'

import { MongooseModule } from '@nestjs/mongoose'
import { Project, ProjectSchema } from './schema/project.schema'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { UsersModule } from 'src/iam/users/users.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Project.name,
        useFactory: () => {
          const schema = ProjectSchema

          return schema
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, FactoryUtils],
  exports: [ProjectsService],
})
export class ProjectsModule {}
