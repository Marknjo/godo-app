import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'
import { FilterQuery } from 'mongoose'
import { Role } from './schema/role.schema'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { ERoleTypes } from './enums/e-role-types'
import { PerseRoleTypePipe } from './pipes/perse-role-type.pipe'
import { ToggleRoleDto } from './dto/toggle-role.dto'

@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post(':type')
  create(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    @Body() createRoleDto: CreateRoleDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.create(createRoleDto, activeUser, type)
  }

  @Get(':type')
  findAll(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    filters: FilterQuery<Role>,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.findAll(filters, activeUser, type)
  }

  @Get(':type/:roleId')
  findOne(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    @Param('roleId', PerseMongoIdPipe) roleId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.findOne(roleId, activeUser, type)
  }

  @Patch(':type/:roleId')
  update(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    @Param('roleId', PerseMongoIdPipe) roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.update(roleId, updateRoleDto, activeUser, type)
  }

  @Patch(':type/toggle/:roleId')
  toggle(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    @Param('roleId', PerseMongoIdPipe) roleId: string,
    @Body() toggleRoleDto: ToggleRoleDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.toggle(roleId, toggleRoleDto, activeUser, type)
  }

  @Delete(':type/:roleId')
  remove(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    @Param('roleId', PerseMongoIdPipe) roleId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.remove(roleId, activeUser, type)
  }
}
