import { IsBoolean } from 'class-validator'

export class ToggleTodoStatusDto {
  @IsBoolean()
  isEnabled: boolean
}
