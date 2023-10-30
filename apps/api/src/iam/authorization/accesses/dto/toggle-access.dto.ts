import { IsBoolean, IsOptional } from 'class-validator'

export class ToggleAccessDto {
  @IsOptional()
  @IsBoolean()
  isEnabled: boolean
}
