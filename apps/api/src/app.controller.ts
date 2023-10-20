import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { Serialize } from './common/decorators/serialize.decorator'
import { AppResponseDto } from './dtos/app-response.dto'
import { MongoIdPipe } from './common/pipes/mongo-id.pipe'
import { CreateAppDto } from './dtos/create-app.dto'
import { AppQueryDto } from './dtos/app-query.dto'

@Serialize(AppResponseDto)
@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query() query: AppQueryDto) {
    return this.appService.getHello(query)
  }

  @Post()
  getHelloPost(@Body() content: CreateAppDto) {
    return this.appService.getHolloPost(content)
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  findOneHello(@Param('id', MongoIdPipe) id: string) {
    return {
      value: `${id}`,
    }
  }
}
