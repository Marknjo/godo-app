import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { FilterQuery } from 'mongoose'

import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

import { AccessesService } from './accesses.service'
import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { Access } from './schema/access.schema'
import { ToggleAccessDto } from './dto/toggle-access.dto'

@Controller({
  path: 'accesses',
  version: '1',
})
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  create(
    @Body() createAccessDto: CreateAccessDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.create(createAccessDto, activeUser)
  }

  @Get()
  findAll(
    @ActiveUser() activeUser: IActiveUser,
    filters?: FilterQuery<Access>,
  ) {
    return this.accessesService.findAll(activeUser, filters)
  }

  @Get(':accessesId')
  findOne(
    @Param('accessesId', PerseMongoIdPipe) accessesId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.findOne(accessesId, activeUser)
  }

  @Patch(':accessesId')
  update(
    @Param('accessesId', PerseMongoIdPipe) accessesId: string,
    @Body() updateAccessDto: UpdateAccessDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.update(accessesId, updateAccessDto, activeUser)
  }

  @Patch(':accessesId/toggle')
  toggleAccess(
    @Param('accessesId', PerseMongoIdPipe) accessesId: string,
    @Body() updateAccessDto: ToggleAccessDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.update(accessesId, updateAccessDto, activeUser)
  }

  @Delete(':accessesId')
  remove(
    @Param('accessesId', PerseMongoIdPipe) accessesId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.remove(accessesId, activeUser)
  }
}
