import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello() {
    return {
      data: {
        value: 'Hello World!',
      },
      page: 3,
      limit: 10,
      totalResults: 400,
    }
  }
}
