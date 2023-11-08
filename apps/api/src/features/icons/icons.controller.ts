import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { IconsService } from './icons.service'
import { CreateIconDto } from './dto/create-icon.dto'
import { UpdateIconDto } from './dto/update-icon.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { ToggleIconsStatusDto } from './dto/toggle-icons-status.dto'

@Controller('icons')
export class IconsController {
  constructor(private readonly iconsService: IconsService) {}

  @Post()
  create(@Body() createIconDto: CreateIconDto) {
    return this.iconsService.create(createIconDto)
  }

  @Get()
  findAll() {
    return this.iconsService.findAll()
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
    @Param('iconId', PerseMongoIdPipe) categoryId: string,
    @Body() toggleStatusDto: ToggleIconsStatusDto,
  ) {
    return this.iconsService.toggleStatus(categoryId, toggleStatusDto)
  }

  @Delete(':iconId')
  remove(@Param('iconId', PerseMongoIdPipe) iconId: string) {
    return this.iconsService.remove(iconId)
  }
}
