import {
  BadRequestException,
  ConflictException,
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
import { ERoles } from '../enums/e-roles.enum'

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger()

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

  async findOne(userId: string, activeUser: IActiveUser) {
    return `This action returns a #${userId} user`
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${userId} user`
  }

  async remove(userId: string, activeUser: IActiveUser) {
    return `This action removes a #${userId} user`
  }
}
