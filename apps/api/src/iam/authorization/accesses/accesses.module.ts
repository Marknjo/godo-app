import { Module } from '@nestjs/common'
import { AccessesService } from './accesses.service'
import { AccessesController } from './accesses.controller'

@Module({
  controllers: [AccessesController],
  providers: [AccessesService],
})
export class AccessesModule {}
