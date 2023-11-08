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
import { ToggleCategoryStatusDto } from './dto/toggle-category-status.dto'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { CategoryResponseDto } from './dto/category-response.dto'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { EAuthTypes } from 'src/iam/authentication/enums/e-auth-types.enum'
import { AccessAuth } from 'src/iam/authorization/decorators/access-auth.decorator'
import { EAccessAuthTypes } from 'src/iam/authorization/enums/e-access-auth-types.enum'
import { RestrictToRole } from 'src/iam/authorization/decorators/restrict-to-role.decorator'
import { eAllMembersMap, ePremiumSubscribers } from 'src/iam/enums/e-roles.enum'

@Serialize(CategoryResponseDto)
@RestrictToRole(...ePremiumSubscribers, ...eAllMembersMap)
@AccessAuth(EAccessAuthTypes.ROLE)
@Auth(EAuthTypes.BEARER)
@Controller({
  path: 'categories',
  version: '1',
})
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

  @Patch(':categoryId')
  toggleStatus(
    @Param('categoryId', PerseMongoIdPipe) categoryId: string,
    @Body() toggleStatusDto: ToggleCategoryStatusDto,
  ) {
    return this.categoriesService.toggleStatus(categoryId, toggleStatusDto)
  }

  @Delete(':categoryId')
  remove(@Param('categoryId', PerseMongoIdPipe) categoryId: string) {
    return this.categoriesService.remove(categoryId)
  }
}
