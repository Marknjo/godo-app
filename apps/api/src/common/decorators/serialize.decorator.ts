import { SetMetadata } from '@nestjs/common'

export const SERIALIZE_TYPE_KEY = 'serialize-type'

export interface TGenericConstructor {
  new (...args: any[]): object
}

export const Serialize = <T extends TGenericConstructor>(dto: T) =>
  SetMetadata(SERIALIZE_TYPE_KEY, dto)
