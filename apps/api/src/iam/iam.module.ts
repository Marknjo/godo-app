import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { HashingService } from './authentication/bcrypt/hashing.service'
import { BcryptService } from './authentication/bcrypt/bcrypt.service'
import { AuthController } from './authentication/auth/auth.controller'
import { AuthService } from './authentication/auth/auth.service'

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class IamModule {}
