import { Module } from '@nestjs/common'

import { MongooseModule } from '@nestjs/mongoose'
import { Project, ProjectSchema } from './schema/project.schema'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'

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
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
