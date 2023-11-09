import { IsBoolean } from 'class-validator'

export class ToggleProjectStatusDto {
  @IsBoolean()
  isEnabled: boolean
}
