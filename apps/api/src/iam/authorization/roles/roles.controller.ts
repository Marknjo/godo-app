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
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { RoleResponseDto } from './dto/role-response.dto'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { RestrictToRole } from '../decorators/restrict-to-role.decorator'
import {
  EMembers,
  EPremiumSubscribers,
  eAdminMembersMap,
} from 'src/iam/enums/e-roles.enum'
import { EAccessAuthTypes } from '../enums/e-access-auth-types.enum'
import { AccessAuth } from '../decorators/access-auth.decorator'

@Serialize(RoleResponseDto)
@RestrictToRole(EPremiumSubscribers.ADMIN, [
  EMembers.ADMIN_MANAGER,
  EPremiumSubscribers.ADMIN,
])
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
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

  @RestrictToRole(EPremiumSubscribers.ADMIN, ...eAdminMembersMap)
  @Get(':type')
  findAll(
    @Param('type', PerseRoleTypePipe) type: ERoleTypes,
    filters: FilterQuery<Role>,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.rolesService.findAll(filters, activeUser, type)
  }

  @RestrictToRole(EPremiumSubscribers.ADMIN, ...eAdminMembersMap)
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
