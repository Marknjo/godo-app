import { Expose } from 'class-transformer'
import { EResponseStatuses } from '../enums/e-response-statuses'

/**
 * This class shows default data a response is allowed to respond with
 *
 */
export class DefaultResponseSerializerDto {
  @Expose()
  status?: EResponseStatuses

  @Expose()
  results?: number

  @Expose()
  message?: string

  @Expose()
  accessToken?: EResponseStatuses

  @Expose()
  refreshToken?: number

  /**
   * Pagination fields
   */
  @Expose()
  page?: number

  @Expose()
  limit?: number

  @Expose()
  totalResults?: number

  @Expose()
  nextPage?: string

  @Expose()
  prevPage?: string
}
