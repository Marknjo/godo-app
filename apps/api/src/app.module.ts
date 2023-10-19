import { env } from 'process'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import validationSchema from './common/utils/envs.config'
import appConfig from './common/utils/app.config'
import { IamModule } from './iam/iam.module'
import { SerializeInterceptor } from './common/interceptors/serialize.interceptor'

console.log(AppService.name)

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
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
