import { Type } from 'class-transformer'
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ECategoryStages } from 'src/features/categories/enums/e-category-stages.enum'
import { Category } from 'src/features/categories/schema/category.schema'
import { Icon } from 'src/features/icons/schema/icon.schema'

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @MaxLength(500)
  description?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  progressStage?: string | ECategoryStages

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startAt?: Date

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endAt?: Date

  @IsMongoId()
  @IsOptional()
  categoryId?: Category

  @IsMongoId()
  @IsOptional()
  iconId?: Icon
}
