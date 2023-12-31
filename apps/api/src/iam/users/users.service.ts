import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common'
import { FilterQuery, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { FactoryUtils } from 'src/common/services/factory.utils'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { IActiveUser } from '../interfaces/i-active-user'
import { TUserDoc, User } from './schema/user.schema'
import { HashingService } from '../authentication/bcrypt/hashing.service'
import { EPremiumSubscribers } from '../enums/e-roles.enum'

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger(UsersService.name)

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<TUserDoc>,

    private readonly hashingService: HashingService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // data preparation
      const userDetails = new User()
      userDetails.username = createUserDto.username
      userDetails.email = createUserDto.email
      userDetails.bio = createUserDto?.bio
      userDetails.profileImg = createUserDto?.profileImg

      // hash password
      userDetails.password = await this.hashingService.hash(
        createUserDto.password,
      )

      // create new user
      const newUser = await this.userModel.create(userDetails)

      // @TODO: sign token - not applicable

      // @TODO: Send email to created user to invite them

      return newUser
    } catch (error) {
      // logging errors
      this.logger.warn(`Creating user failed`)
      this.logger.error(error)

      // handle errors
      if (error.name.toLowerCase().includes('validation')) {
        throw new BadRequestException(error.message)
      }

      if (error.code === 11000) {
        throw new ConflictException(`Email already in use`)
      }

      throw new InternalServerErrorException('Error creating new user')
    }
  }

  async findAll(filters: FilterQuery<User> = {}, activeUser: IActiveUser) {
    return this.userModel.find({
      ...filters,
    })
  }

  async findOne(
    userId: string,
    activeUser: IActiveUser,
    filters?: FilterQuery<User>,
  ) {
    this.throwIfAccessingOtherUsers(activeUser, userId, 'Finding this user')

    const foundUser = await this.findOneHelper(
      'id',
      {
        ...filters,
      },
      userId,
    )

    return foundUser
  }

  async update(
    userId: string,
    updateUserDto: Partial<
      | UpdateUserDto
      | {
          totalTeamMembers: number
        }
    >,
    activeUser?: IActiveUser,
    filters?: FilterQuery<User>,
  ) {
    // prevent user from updating other users fields
    this.throwIfAccessingOtherUsers(activeUser, userId, 'Updating')

    // handle updating
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        ...filters,
      },
      updateUserDto,
      {
        new: true,
      },
    )

    // handle update errors
    this.throwIfUserNotFound(updatedUser, userId, 'updating')

    // response
    this.logger.log(`User with id ${userId} was successfully updated`)

    return updatedUser
  }

  async remove(userId: string, activeUser: IActiveUser) {
    const whoIs = this.factoryUtils.whoIs(activeUser)

    this.throwIfSelfDeletion(userId, whoIs)

    this.throwIfSuperAdminDeletion(userId, activeUser)

    // try and delete user
    const deletedUser = await this.userModel.findOneAndDelete({
      _id: userId,
    })

    this.throwIfUserNotFound(deletedUser, userId, 'deleting')

    // message
    const message = `User with ${userId} was successfully deleted`
    this.logger.log(message)

    return {
      message,
    }
  }

  /**
   * --------------------------------------------------------------
   *
   *                     HELPER METHODS
   *
   * --------------------------------------------------------------
   */

  async findOneHelper(
    type: 'custom' | 'id' = 'id',
    filters: FilterQuery<User> = {},
    searchBy?: string,
  ) {
    const foundUser = await this.userModel.findOne({
      ...(type === 'custom' ? filters : { _id: searchBy }),
      ...filters,
    })

    // validation
    this.throwIfUserNotFound(foundUser, searchBy, 'finding')

    return foundUser
  }

  async removeHelper(userId: string) {
    return await this.userModel.deleteOne({ _id: userId })
  }

  /**
   * prevent user from updating other users fields
   * @param activeUser
   * @param userId
   */
  private throwIfAccessingOtherUsers(
    activeUser: IActiveUser,
    userId: string,
    action: string,
  ) {
    const isAdmin = !!EPremiumSubscribers[activeUser.baseRole.toUpperCase()]

    if (
      (activeUser.sub !== userId && !isAdmin) ||
      (userId !== activeUser.baseRole && !isAdmin)
    ) {
      throw new ForbiddenException(`${action} not allow`)
    }
  }

  private throwIfUserNotFound(user: User, userId: string, action: string) {
    if (!user) {
      this.logger.error(`${action} user with ${userId} failed`)

      throw new BadRequestException(
        `Oops! looks like  ${action} user with id ${userId} failed`,
      )
    }
  }

  /**
   * A Admin manager cannot delete root admin
   *  - Can't delete super admin
   * @param userId
   * @param activeUser
   */
  private throwIfSuperAdminDeletion(userId: string, activeUser: IActiveUser) {
    if (userId === activeUser.sub) {
      this.logger.warn(`Manager was trying to delete super admin 🤔🤔🤔`)

      throw new BadRequestException(
        `Your request to delete this user has been declined`,
      )
    }
  }

  /**
   * Prevent a user from deleting themselves
   * - users must not delete themselves
   *
   * @param userId
   * @param whoIs
   */
  private throwIfSelfDeletion(userId: string, whoIs: string) {
    if (userId === whoIs) {
      this.logger.warn(`User was trying to delete themselves`)
      throw new BadRequestException(
        `Denied to delete user: Can't delete yourself`,
      )
    }
  }
}
