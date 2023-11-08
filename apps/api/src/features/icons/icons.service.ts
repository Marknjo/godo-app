import { Injectable } from '@nestjs/common'
import { CreateIconDto } from './dto/create-icon.dto'
import { UpdateIconDto } from './dto/update-icon.dto'
import { ToggleIconsStatusDto } from './dto/toggle-icons-status.dto'

@Injectable()
export class IconsService {
  create(createIconDto: CreateIconDto) {
    return 'This action adds a new icon'
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
