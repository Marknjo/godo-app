import { Expose } from 'class-transformer'

export class AppResponseDto {
  @Expose()
  value: string

  @Expose()
  description: string
}
