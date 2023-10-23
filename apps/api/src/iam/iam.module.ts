import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { HashService } from './authentication/bcrypt/hash.service'
import { BcryptService } from './authentication/bcrypt/bcrypt.service'

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: HashService,
      useClass: BcryptService,
    },
  ],
})
export class IamModule {}
