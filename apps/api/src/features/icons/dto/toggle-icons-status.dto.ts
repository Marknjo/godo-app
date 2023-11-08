import { IsBoolean } from 'class-validator'

export class ToggleIconsStatusDto {
  @IsBoolean()
  isEnabled: boolean
}
