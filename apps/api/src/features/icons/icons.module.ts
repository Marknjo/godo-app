import { Module } from '@nestjs/common'
import { IconsService } from './icons.service'
import { IconsController } from './icons.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Icon, IconSchema } from './schema/icon.schema'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Icon.name,
        useFactory: () => {
          const schema = IconSchema

          return schema
        },
      },
    ]),
  ],
  controllers: [IconsController],
  providers: [IconsService],
  exports: [IconsService],
})
export class IconsModule {}
