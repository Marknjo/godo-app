import { Type } from 'class-transformer'
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { EProjectStages } from 'src/features/projects/enums/e-project-stages.enum'
import { Project } from 'src/features/projects/schema/project.schema'
import { Icon } from 'src/features/icons/schema/icon.schema'
import { Todo } from '../schema/todo.schema'

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
  progressStage?: string | EProjectStages

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
  projectId?: Project

  @IsMongoId()
  @IsOptional()
  iconId?: Icon

  @IsMongoId()
  @IsOptional()
  dependsOn?: Todo
}
