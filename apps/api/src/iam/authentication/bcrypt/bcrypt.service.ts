import { Injectable } from '@nestjs/common'
import { HashService } from './hash.service'
import { compare, genSalt, hash } from 'bcrypt'

@Injectable()
export class BcryptService implements HashService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt(11)

    return hash(data, salt)
  }
  async compare(plainData: string, hashedData: string): Promise<boolean> {
    return compare(plainData, hashedData)
  }
}
