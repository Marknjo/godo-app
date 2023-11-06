import { SetMetadata } from '@nestjs/common'
import { EAccessAuthTypes } from '../enums/e-access-auth-types.enum'

export const ACCESS_AUTH_KEY = 'ACCESS_AUTH_KEY'

export const AccessAuth = (...accessType: EAccessAuthTypes[]) =>
  SetMetadata(ACCESS_AUTH_KEY, accessType)
