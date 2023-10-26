import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { HashingService } from './authentication/bcrypt/hashing.service'
import { BcryptService } from './authentication/bcrypt/bcrypt.service'
import { AuthController } from './authentication/auth/auth.controller'
import { AuthService } from './authentication/auth/auth.service'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { RolesModule } from './authorization/roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule],
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
