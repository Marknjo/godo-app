import { IsString } from 'class-validator'

export class CreateAppDto {
  @IsString()
  description: string
}
