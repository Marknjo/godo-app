import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'
import { ECategoryStages } from '../enums/e-category-stages.enum'
import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'

export class CategoryResponseDto extends DefaultResponseDto {
  @Expose()
  title: string

  @Expose()
  description?: string

  @Expose()
  stages?: Array<ECategoryStages | string>

  @Type(() => SlimIconResponseDto)
  iconsId?: SlimIconResponseDto

  @Expose()
  isEnabled: boolean
}

export class SlimCategoryResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  stages?: Array<ECategoryStages | string>
}
