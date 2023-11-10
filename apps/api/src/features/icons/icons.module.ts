import { Module } from '@nestjs/common'
import { IconsService } from './icons.service'
import { IconsController } from './icons.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Icon, IconSchema } from './schema/icon.schema'
import { FactoryUtils } from 'src/common/services/factory.utils'

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
  providers: [IconsService, FactoryUtils],
  exports: [IconsService],
})
export class IconsModule {}
