import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { CreateIconDto } from './dto/create-icon.dto'
import { UpdateIconDto } from './dto/update-icon.dto'
import { ToggleIconsStatusDto } from './dto/toggle-icons-status.dto'
import { Icon } from './schema/icon.schema'
import { FactoryUtils } from 'src/common/services/factory.utils'

@Injectable()
export class IconsService {
  private readonly logger: LoggerService = new Logger(IconsService.name)

  constructor(
    @InjectModel(Icon.name)
    private readonly iconModel: Model<Icon>,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createIconDto: CreateIconDto) {
    this.logger.log(`Adding new icon`)
    try {
      // 1). slugify name
      const slug = this.factoryUtils.slugify(createIconDto.prettyName, 'icon')

      // 2). save the icon
      const createdIcon = await this.iconModel.create({
        ...createIconDto,
        slug,
      })

      return {
        message: `Icon ${createdIcon.prettyName} was successfully created`,
        data: createdIcon,
      }
    } catch (error) {
      this.logger.warn(`Error while adding a new icon`)
      this.logger.error(error)

      if (error.code === 11000) {
        const message = this.factoryUtils.autoGenerateDuplicateMessage(error)
        throw new ConflictException(message)
      }

      throw new InternalServerErrorException(
        `Something unexpected happened while creating a new icon`,
      )
    }
  }

  findAll() {
    return `This action returns all icons`
  }

  findOne(iconId: string) {
    return `This action returns a #${iconId} icon`
  }

  update(iconId: string, updateIconDto: UpdateIconDto) {
    return `This action updates a #${iconId} icon`
  }

  toggleStatus(iconId: string, toggleStatusDto: ToggleIconsStatusDto) {
    return `toggleStatus`
  }

  remove(iconId: string) {
    return `This action removes a #${iconId} icon`
  }
}
