import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Serialize } from './common/decorators/serialize.decorator'
import { AppResponseDto } from './dtos/app-response.dto'

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Serialize(AppResponseDto)
  @Get()
  getHello() {
    return this.appService.getHello()
  }
}
