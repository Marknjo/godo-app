import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category'
  }

  findAll() {
    return `This action returns all categories`
  }

  findOne(categoryId: string) {
    return `This action returns a #${categoryId} category`
  }

  update(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${categoryId} category`
  }

  remove(categoryId: string) {
    return `This action removes a #${categoryId} category`
  }
}
