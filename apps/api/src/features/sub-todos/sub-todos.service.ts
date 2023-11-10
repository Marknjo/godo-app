import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'
import { FilterQuery, Model } from 'mongoose'
import { SubTodo } from './schema/sub-todo.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

@Injectable()
export class SubTodosService {
  private readonly logger: LoggerService = new Logger(SubTodosService.name)

  constructor(
    @InjectModel(SubTodo.name)
    private readonly subTodoModel: Model<SubTodo>,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  create(createSubTodoDto: CreateSubTodoDto, activeUser: IActiveUser) {
    return 'This action adds a new subTodo'
  }

  findAll(filters: FilterQuery<SubTodo>, activeUser: IActiveUser) {
    return `This action returns all subTodos`
  }

  findOne(subTodoId: string, activeUser: IActiveUser) {
    return `This action returns a #${subTodoId} subTodo`
  }

  update(
    subTodoId: string,
    updateSubTodoDto: UpdateSubTodoDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${subTodoId} subTodo`
  }

  remove(subTodoId: string, activeUser: IActiveUser) {
    return `This action removes a #${subTodoId} subTodo`
  }
}
