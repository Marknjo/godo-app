import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { IconsService } from './icons.service'
import { CreateIconDto } from './dto/create-icon.dto'
import { UpdateIconDto } from './dto/update-icon.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ToggleIconsStatusDto } from './dto/toggle-icons-status.dto'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { IconResponseDto } from './dto/icon-response.dto'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import {
  EPremiumSubscribers,
  eAdminMembersMap,
} from 'src/iam/enums/e-roles.enum'
import { FilterQuery } from 'mongoose'
import { Icon } from './schema/icon.schema'

@Serialize(IconResponseDto)
@RestrictToRole(EPremiumSubscribers.ADMIN, ...eAdminMembersMap)
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'icons',
  version: '1',
})
export class IconsController {
  constructor(private readonly iconsService: IconsService) {}

  @Post()
  create(@Body() createIconDto: CreateIconDto) {
    return this.iconsService.create(createIconDto)
  }

  @Get()
  findAll(@Query() filters: FilterQuery<Icon>) {
    return this.iconsService.findAll(filters)
  }

  @Get(':iconId')
  findOne(@Param('iconId', PerseMongoIdPipe) iconId: string) {
    return this.iconsService.findOne(iconId)
  }

  @Patch(':iconId')
  update(
    @Param('iconId', PerseMongoIdPipe) iconId: string,
    @Body() updateIconDto: UpdateIconDto,
  ) {
    return this.iconsService.update(iconId, updateIconDto)
  }

  @Patch(':iconId')
  toggleStatus(
    @Param('iconId', PerseMongoIdPipe) ProjectId: string,
    @Body() toggleStatusDto: ToggleIconsStatusDto,
  ) {
    return this.iconsService.toggleStatus(ProjectId, toggleStatusDto)
  }

  @Delete(':iconId')
  remove(@Param('iconId', PerseMongoIdPipe) iconId: string) {
    return this.iconsService.remove(iconId)
  }
}
