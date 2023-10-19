import { Expose } from 'class-transformer'

export class DefaultResponseDto {
  @Expose()
  id: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}
