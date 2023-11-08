import { IsBoolean } from 'class-validator'

export class ToggleCategoryStatusDto {
  @IsBoolean()
  isEnabled: boolean
}
