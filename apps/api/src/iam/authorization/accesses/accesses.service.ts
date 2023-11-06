import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, PopulateOption, PopulateOptions } from 'mongoose'

import { FactoryUtils } from 'src/common/services/factory.utils'
import { UsersService } from 'src/iam/users/users.service'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { Access } from './schema/access.schema'
import { RolesService } from '../roles/roles.service'
import { EPremiumSubscribers, ERoles } from 'src/iam/enums/e-roles.enum'
import { ERoleTypes } from '../roles/enums/e-role-types'
import { TAccessResponseDoc } from './types/t-access-response-doc.type'

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
    try {
      // ensure user can create an access before proceeding
      const errorMessage =
        'Failed to assign the requested role because you lack enough credentials'
      const roleToAssign = createAccessDto.roleId.toString()

      await this.validateRequestAction(activeUser, roleToAssign, errorMessage)

      // can create the new access
      createAccessDto['accountOwner'] = activeUser.sub
      createAccessDto['baseRole'] = activeUser.baseRole

      const createdAccess = await this.createAccessHelper(createAccessDto)

      return createdAccess
    } catch (error) {
      // logger
      this.logger.warn(error.message)
      this.logger.error(error)

      // validation messages
      if (error instanceof NotFoundException) {
        new NotFoundException(error.message)
      }

      if (error instanceof ForbiddenException) {
        new ForbiddenException(error.message)
      }

      if (error.code === 11000) {
        const message = this.factoryUtils.autoGenerateDuplicateMessage(error)
        throw new ConflictException(message || error.message)
      }

      if (error instanceof Error && error.name === 'ValidationError') {
        throw new BadRequestException(error.message)
      }

      throw new InternalServerErrorException(
        'Server failed to add new access, please try again later',
      )
    }
  }

  async findAll(activeUser: IActiveUser, filters?: FilterQuery<Access>) {
    // @TODO: implement pagination
    return this.accessesModel.find({
      ...filters,
      accountOwner: activeUser.sub,
    })
  }

  async findOne(
    accessId: string,
    activeUser: IActiveUser,
    isEnabled?: boolean,
  ) {
    // users can only fetch their own access - not others, especially if not admin or manager
    const assignedTo = activeUser?.memberId

    const foundAccess = await this.findOneHelper(
      false,
      {
        accountOwner: activeUser.sub,
        ...(isEnabled ? { isEnabled: true } : {}),
        ...(assignedTo ? { assignedTo } : {}),
      },
      accessId,
    )

    return foundAccess
  }

  async update(
    accessId: string,
    updateAccessDto: Partial<ToggleEvent & UpdateAccessDto>,
    activeUser: IActiveUser,
  ) {
    // find first the access user want to update
    const foundAccess = await this.findOne(accessId, activeUser)

    const roleId = foundAccess.roleId.toString()

    // validate update
    if (updateAccessDto?.roleId) {
      const errorMessage = 'Not enough credentials'

      await this.validateRequestAction(activeUser, roleId, errorMessage)
    }

    const updatedAccess = await foundAccess.updateOne(
      {
        _id: accessId,
        accountOwner: activeUser.sub,
      },
      updateAccessDto,
    )

    return updatedAccess
  }

  async remove(accessId: string, activeUser: IActiveUser) {
    // find first the access user want to delete
    const foundAccess = await this.findOne(accessId, activeUser)

    const roleId = foundAccess.roleId.toString()

    // ensure user can delete validation
    const errorMessage = 'Not enough credentials'

    await this.validateRequestAction(activeUser, roleId, errorMessage)

    // delete the access
    await foundAccess.deleteOne({
      _id: accessId,
      accountOwner: activeUser.sub,
    })

    return {
      message: 'Access was successfully deleted',
    }
  }

  /**
   * --------------------------------------------
   *                     HELPERS
   * --------------------------------------------
   */

  async findOneHelper(
    isCustomSearchBy: boolean,
    filters: FilterQuery<Access> = {},
    searchBy?: string,
  ) {
    let foundAccess = await this.accessesModel.findOne({
      ...(!isCustomSearchBy ? { _id: searchBy } : {}),
      ...filters,
    })

    // validation
    if (!foundAccess) {
      throw new NotFoundException(`Access not found`)
    }

    // populate fields
    const populateOptions = this.populateHelper()

    foundAccess =
      await foundAccess.populate<TAccessResponseDoc>(populateOptions)

    return foundAccess as TAccessResponseDoc
  }

  async createAccessHelper(createAccessDto: CreateAccessDto) {
    return await this.accessesModel.create(createAccessDto)
  }

  private populateHelper(): PopulateOptions[] {
    return [
      { path: 'accountOwner' },
      { path: 'assignedTo' },
      { path: 'roleId', select: 'id name' },
    ]
  }

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
      role === ERoles.ADMIN || baseRole === EPremiumSubscribers.ADMIN
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
      if (
        baseRole !== EPremiumSubscribers.ADMIN &&
        roleName !== ERoles.MEMBER
      ) {
        throw new ForbiddenException(errorMessage)
      }

      // admin manager
      if (
        baseRole === EPremiumSubscribers.ADMIN &&
        (roleName === ERoles.ADMIN ||
          roleName === ERoles.MANAGER ||
          roleName === ERoles.MEMBER ||
          roleName === ERoles.ADMIN_MANAGER)
      ) {
        throw new ForbiddenException(errorMessage)
      }
    }

    // handle account owners
    if (
      (role !== ERoles.ADMIN && roleName !== ERoles.MANAGER) ||
      (role !== ERoles.ADMIN && roleName !== ERoles.MEMBER)
    ) {
      throw new ForbiddenException(errorMessage)
    }
  }
}
