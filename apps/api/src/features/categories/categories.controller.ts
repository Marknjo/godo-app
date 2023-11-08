import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':categoryId')
  findOne(@Param('categoryId', PerseMongoIdPipe) categoryId: string) {
    return this.categoriesService.findOne(categoryId)
  }

  @Patch(':categoryId')
  update(
    @Param('categoryId', PerseMongoIdPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto)
  }

  @Delete(':categoryId')
  remove(@Param('categoryId', PerseMongoIdPipe) categoryId: string) {
    return this.categoriesService.remove(categoryId)
  }
}
