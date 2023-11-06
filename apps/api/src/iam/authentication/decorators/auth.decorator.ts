import { SetMetadata } from '@nestjs/common'
import { EAuthTypes } from '../enums/e-auth-types.enum'

export const AUTH_KEY = 'AUTH_KEY'

export const Auth = (...args: EAuthTypes[]) => SetMetadata(AUTH_KEY, args)
