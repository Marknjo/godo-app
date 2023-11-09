import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimCategoryResponseDto } from 'src/features/categories/dto/category-response.dto'
import { ECategoryStages } from 'src/features/categories/enums/e-category-stages.enum'
import { SlimIconResponseDto } from 'src/features/icons/dto/icon-response.dto'
import { SlimUserResponseDto } from 'src/iam/users/dto/user-response.dto'

export class TodoResponseDto extends DefaultResponseDto {
  @Expose()
  title: string

  @Expose()
  description?: string

  @Expose()
  progressStage?: string | ECategoryStages

  @Expose()
  startAt?: Date

  @Expose()
  endAt?: Date

  @Expose()
  @Type(() => SlimUserResponseDto)
  userId: SlimUserResponseDto

  @Expose()
  @Type(() => SlimCategoryResponseDto)
  categoryId?: SlimCategoryResponseDto

  @Expose()
  @Type(() => SlimIconResponseDto)
  iconId?: SlimIconResponseDto

  @Expose()
  isEnabled: boolean
}

export class SlimTodoResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  progressStage?: string | ECategoryStages

  @Expose()
  startAt?: Date

  @Expose()
  endAt?: Date

  @Expose()
  isEnabled: boolean
}
