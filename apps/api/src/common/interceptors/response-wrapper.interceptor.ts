import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, map } from 'rxjs'
import { EResponseStatuses } from '../enums/e-response-statuses'

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Section intercepts incoming requests

    return next.handle().pipe(
      map(resData => {
        return this.transformResponseData(context, resData)
      }),
    )
  }

  /**
   * Helper method to transform response data to a standard format repose
   * Common field
   *   - @NOTE: see DefaultResponseSerializerDto for common/default fields
   * @param context
   * @param resData
   * @returns
   */
  private transformResponseData(context: ExecutionContext, resData: any) {
    const req = context.switchToHttp().getRequest<Request>()

    const paginationUrl = this.generatePaginationUrl(req)

    return {
      // get status
      status: resData?.status ? resData.status : EResponseStatuses.SUCCESS,

      // get access token
      ...(resData?.accessToken ? { accessToken: resData.accessToken } : {}),

      // get refresh token
      ...(resData?.refreshToken ? { refreshToken: resData.refreshToken } : {}),

      // Response message
      message: resData?.message ? resData.message : 'Request Successful',

      // Pagination
      ...(resData?.page ? { page: resData?.page } : {}),
      ...(resData?.limit ? { limit: resData?.limit } : {}),

      // calculate results count
      ...(resData?.totalResults
        ? { totalResults: resData?.totalResults }
        : Array.isArray(resData) || Array.isArray(resData.data)
        ? { totalResults: resData.length || resData.data.length }
        : { totalResults: 1 }),

      ...(resData?.page &&
      resData?.limit &&
      resData?.page < Math.ceil(resData?.totalResults / resData?.limit)
        ? { nextPage: paginationUrl(resData?.page + 1, resData?.limit) }
        : {}),
      ...(resData?.page && resData?.limit && resData?.page > 1
        ? {
            prevPage: paginationUrl(resData?.page - 1, resData?.limit),
          }
        : {}),

      // Data
      data: resData?.data ? resData.data : resData,
    }
  }

  /**
   * Auto pagination Url generator (helper method)
   *
   * @param req
   * @returns
   */
  private generatePaginationUrl(req: Request) {
    let host = req.hostname
    host = host === 'localhost' ? `${host}:${process.env?.API_PORT}` : host

    const protocol = req.protocol

    const path = req.originalUrl.split('?').at(0)

    const paginationUrl = (page: number, perPage: number) =>
      `${protocol}://${host}${path}?page=${page}&limit=${perPage}`

    return paginationUrl
  }
}
