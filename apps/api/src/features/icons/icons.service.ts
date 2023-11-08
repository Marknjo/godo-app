import { Injectable } from '@nestjs/common'
import { CreateIconDto } from './dto/create-icon.dto'
import { UpdateIconDto } from './dto/update-icon.dto'

@Injectable()
export class IconsService {
  create(createIconDto: CreateIconDto) {
    return 'This action adds a new icon'
  }

  findAll() {
    return `This action returns all icons`
  }

  findOne(id: number) {
    return `This action returns a #${id} icon`
  }

  update(id: number, updateIconDto: UpdateIconDto) {
    return `This action updates a #${id} icon`
  }

  remove(id: number) {
    return `This action removes a #${id} icon`
  }
}
