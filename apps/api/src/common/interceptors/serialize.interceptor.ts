import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, map } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import {
  SERIALIZE_TYPE_KEY,
  TGenericConstructor,
} from '../decorators/serialize.decorator'
import { DefaultResponseSerializerDto } from '../dtos/default-Response-serializer.dto'

type TransformedData = Partial<DefaultResponseSerializerDto> & {
  data: TGenericConstructor
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return this.responseSerializer(context, data)
      }),
    )
  }

  /**
   * A helper method that decouples serialization logic from the intercept method
   * @param context
   * @param transformedData
   * @returns serialized data in the format of the dto object
   */
  private responseSerializer(
    context: ExecutionContext,
    transformedData: TransformedData,
  ) {
    // get response dto object shape - from handler or from controller
    const dtoDecorator = this.reflector.getAllAndOverride<TGenericConstructor>(
      SERIALIZE_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    )

    // transform default dto response
    const defaultData = plainToInstance(
      DefaultResponseSerializerDto,
      transformedData,
      {
        excludeExtraneousValues: true,
      },
    )

    // transform decorator dto from dtoDecorator & merge with default response
    if (dtoDecorator) {
      const data = plainToInstance(dtoDecorator, transformedData.data, {
        excludeExtraneousValues: true,
      })

      /// merge default response data serializer
      return {
        ...defaultData,
        data,
      }
    }

    /**
     * @NOTE:
     * if a controller does not have a dto (anti-pattern - to be avoided),
     * serialize response based on the default response dto,
     * For security reasons data is not returned.
     * A controller/route handler must implement it's response dto
     */
    return defaultData
  }
}
