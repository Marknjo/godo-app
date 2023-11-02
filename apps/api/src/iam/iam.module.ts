import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { HashingService } from './authentication/bcrypt/hashing.service'
import { BcryptService } from './authentication/bcrypt/bcrypt.service'
import { AuthController } from './authentication/auth/auth.controller'
import { AuthService } from './authentication/auth/auth.service'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { RolesModule } from './authorization/roles/roles.module'
import { AccessesModule } from './authorization/accesses/accesses.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfigs } from './authentication/configs/jwt.configs'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfigs.asProvider()),
    ConfigModule.forFeature(jwtConfigs),
    UsersModule,
    RolesModule,
    AccessesModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
    FactoryUtils,
  ],
  controllers: [AuthController],
})
export class IamModule {}
