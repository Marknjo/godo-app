import { Injectable } from '@nestjs/common'
import { HashingService } from './hashing.service'
import { compare, genSalt, hash } from 'bcrypt'

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt(11)

    return hash(data, salt)
  }
  async compare(plainData: string, hashedData: string): Promise<boolean> {
    return compare(plainData, hashedData)
  }
}
