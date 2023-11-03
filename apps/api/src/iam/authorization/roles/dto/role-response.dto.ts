import { Expose, Type } from 'class-transformer'
import { ERoleTypes } from '../enums/e-role-types'

export class SlimRoleResponseDto {
  @Expose()
  id: string

  @Expose()
  name: string
}

export class RoleResponseDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  description: string

  @Expose()
  isEnabled: boolean

  @Expose()
  @Type(() => SlimRoleResponseDto)
  assignedFor: SlimRoleResponseDto

  @Expose()
  type: ERoleTypes

  @Expose()
  @Type(() => Date)
  createdAt: Date

  @Expose()
  @Type(() => Date)
  updatedAt: Date
}
