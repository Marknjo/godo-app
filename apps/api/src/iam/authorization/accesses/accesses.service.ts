import {
  ForbiddenException,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { FactoryUtils } from 'src/common/services/factory.utils'
import { UsersService } from 'src/iam/users/users.service'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { Access } from './schema/access.schema'
import { RolesService } from '../roles/roles.service'
import { EPremiumRoles, ERoles } from 'src/iam/enums/e-roles.enum'
import { ERoleTypes } from '../roles/enums/e-role-types'

@Injectable()
export class AccessesService {
  private readonly logger: LoggerService = new Logger(AccessesService.name)

  constructor(
    @InjectModel(Access.name)
    private readonly accessesModel: Model<Access>,

    private readonly usersService: UsersService,

    private readonly rolesService: RolesService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createAccessDto: CreateAccessDto, activeUser: IActiveUser) {
    // ensure user can create an access before proceeding
    const errorMessage =
      'Failed to assign the requested role because you lack enough credentials'
    const roleToAssign = createAccessDto.roleId.toString()

    await this.validateRequestAction(activeUser, roleToAssign, errorMessage)

    // create new access
  }

  async findAll(activeUser: IActiveUser, filters?: FilterQuery<Access>) {
    return `This action returns all accesses ${activeUser}`
  }

  async findOne(accessId: string, activeUser: IActiveUser) {
    return `This action returns a #${accessId} access`
  }

  async update(
    accessId: string,
    updateAccessDto: UpdateAccessDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${accessId} access`
  }

  async remove(accessId: string, activeUser: IActiveUser) {
    return `This action removes a #${accessId} access`
  }

  /**
   * --------------------------------------------
   *                     HELPERS
   * --------------------------------------------
   */

  /**
   * Ensures that a user trying to create a role has the right to create it
   * @param activeUser
   * @param createAccessDto
   */
  private async validateRequestAction(
    activeUser: IActiveUser,
    roleId: string,
    errorMessage: string,
  ) {
    const { sub: accountOwner, baseRole, role } = activeUser

    const whoIs = this.factoryUtils.whoIs(activeUser)
    const managerId = whoIs === accountOwner ? undefined : whoIs

    // find type of a the current  user belongs
    const type =
      role === ERoles.ADMIN || baseRole === EPremiumRoles.ADMIN
        ? ERoleTypes.ADMIN
        : ERoleTypes.REGULAR

    // fetch the role user want to assign
    const roleData = await this.rolesService.findOne(roleId, activeUser, type, {
      isEnabled: true,
    })
    const roleName = roleData.name

    // validations
    if (managerId) {
      // handling premium, guest & teams manager
      if (baseRole !== EPremiumRoles.ADMIN && roleName !== ERoles.MEMBER) {
        throw new ForbiddenException(errorMessage)
      }

      // admin manager
      if (
        baseRole === EPremiumRoles.ADMIN &&
        (roleName === ERoles.ADMIN ||
          roleName === ERoles.MANAGER ||
          roleName === ERoles.MEMBER ||
          roleName === ERoles.ADMIN_MANAGER)
      ) {
        throw new ForbiddenException(errorMessage)
      }
    }

    // handle account owners
    if (role !== ERoles.ADMIN) {
      if (roleName !== ERoles.MANAGER && roleName !== ERoles.MEMBER) {
        throw new ForbiddenException(errorMessage)
      }
    }
  }
}
