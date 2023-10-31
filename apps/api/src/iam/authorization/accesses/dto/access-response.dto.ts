import { Expose, Type } from 'class-transformer'
import { SlimRoleResponseDto } from '../../roles/dto/role-response.dto'
import { SlimUserResponseDto } from 'src/iam/users/dto/user-response.dto'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'

export class SlimAccessResponseDto {
  @Expose()
  id: string

  @Expose()
  @Type(() => SlimUserResponseDto)
  assignedTo: SlimUserResponseDto

  @Expose()
  @Type(() => SlimRoleResponseDto)
  roleId: SlimRoleResponseDto
}

export class AccessResponseDto extends DefaultResponseDto {
  @Expose()
  @Type(() => SlimUserResponseDto)
  assignedTo: SlimUserResponseDto

  @Expose()
  @Type(() => SlimRoleResponseDto)
  roleId: SlimRoleResponseDto

  @Expose()
  isActive?: boolean

  @Expose()
  @Type(() => SlimUserResponseDto)
  accountOwner?: SlimUserResponseDto
}
