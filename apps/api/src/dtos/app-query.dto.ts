import { IsOptional, IsString } from 'class-validator'

export class AppQueryDto {
  @IsOptional()
  @IsString()
  name?: string
}
