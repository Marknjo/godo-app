import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import mongoose from 'mongoose'

@Injectable()
export class PerseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(value)

    if (!isValidId) {
      // const
      throw new BadRequestException('Invalid Id format')
    }

    return value
  }
}
