import { env } from 'node:process'
import { registerAs } from '@nestjs/config'

export const jwtConfigs = registerAs('jwt', () => {
  return {
    secret: env.JWT_SECRET,
    audience: env.JWT_TOKEN_AUDIENCE,
    issuer: env.JWT_TOKEN_ISSUER,
    accessTokenTTL: +env.JWT_ACCESS_TOKEN_TTL,
    refreshTokenTTL: +env.JWT_REFRESH_TOKEN_TTL,
  }
})
