import { env } from 'process'
import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import validationSchema from './common/utils/envs.config'
import appConfig from './common/utils/app.config'
import { IamModule } from './iam/iam.module'
import { SerializeInterceptor } from './common/interceptors/serialize.interceptor'
import { AccessTokenGuard } from './iam/authentication/guards/access-token.guard'
import { AuthGuard } from './iam/authentication/guards/auth.guard'
import { AccessesModule } from './iam/authorization/accesses/accesses.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfigs } from './iam/authentication/configs/jwt.configs'
import { AccessGuard } from './iam/authorization/guards/access.guard'
import { RoleAccessGuard } from './iam/authorization/guards/role-access.guard'
import { FeaturesModule } from './features/features.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${env.NODE_ENV}.local`,
      load: [appConfig],
      validationSchema: validationSchema(),
      validationOptions: {
        abortEarly: true,
      },
      ignoreEnvFile: env.NODE_ENV === 'production',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configSrv: ConfigService) => {
        const isDev = !!configSrv.get<string>('NODE_ENV')

        const user = configSrv.get<string>('DB_USER')
        const pass = configSrv.get<string>('DB_PASS')
        const host = configSrv.get<string>('DB_HOST')
        const port = configSrv.get<string>('DB_PORT')
        const defaultDb = configSrv.get<string>('DB_DEFAULT')

        let uri = isDev
          ? configSrv.get<string>('DB_URI_DEV')
          : configSrv.get<string>('DB_URI_PROD')

        uri = uri
          .replace(/{{DB_USER}}/, user)
          .replace(/{{DB_PASS}}/, pass)
          .replace(/{{DB_HOST}}/, host)
          .replace(/{{DB_PORT}}/, port)
          .replace(/{{DB_DEFAULT}}/, defaultDb)

        return {
          uri,
        }
      },
      inject: [ConfigService],
    }),
    IamModule,
    AccessesModule,
    JwtModule.registerAsync(jwtConfigs.asProvider()),
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    RoleAccessGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
