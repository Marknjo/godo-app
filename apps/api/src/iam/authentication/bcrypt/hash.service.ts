import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class HashService {
  /**
   * An abstract method for implementing data hashing
   * @param data a string to hash
   *
   * @returns hashed data
   */
  abstract hash(data: string): Promise<string>

  /**
   * Get a plain data string and compare it with the hashed string
   *
   * @param plainData
   * @param hashedData
   *
   * @returns if comparison matches or fails
   */
  abstract compare(plainData: string, hashedData: string): Promise<boolean>
}
