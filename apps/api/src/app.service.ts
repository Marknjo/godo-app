import { Injectable } from '@nestjs/common'
import { CreateAppDto } from './dtos/create-app.dto'
import { AppQueryDto } from './dtos/app-query.dto'

@Injectable()
export class AppService {
  getHello(query: AppQueryDto) {
    return {
      data: {
        value: `Hello ${query?.name || 'World'}!`,
      },
      page: 3,
      limit: 10,
      totalResults: 400,
    }
  }

  getHolloPost(content: CreateAppDto) {
    return {
      data: content,
    }
  }
}
