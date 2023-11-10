import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { SubTodo } from './schema/sub-todo.schema'
import { CreateSubTodoDto } from './dto/create-sub-todo.dto'
import { UpdateSubTodoDto } from './dto/update-sub-todo.dto'
import { FactoryUtils } from 'src/common/services/factory.utils'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { TSubTodoOptions } from './types/t-sub-todo-options'

@Injectable()
export class SubTodosService {
  private readonly logger: LoggerService = new Logger(SubTodosService.name)

  constructor(
    @InjectModel(SubTodo.name)
    private readonly subTodoModel: Model<SubTodo>,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  create(createSubTodoDto: CreateSubTodoDto, activeUser: IActiveUser) {
    return this.subTodoModel.create({
      ...createSubTodoDto,
      userId: activeUser.sub,
    })
  }

  async findAll(filters: FilterQuery<SubTodo>, activeUser: IActiveUser) {
    const foundTodos = await this.subTodoModel
      .find({
        ...filters,
        userId: activeUser.sub,
      })
      .sort('-createdAt')

    return {
      data: foundTodos,
    }
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

  /**
   * ---------------------------------------------
   *
   *                      HELPERS
   *
   * ---------------------------------------------
   */

  /**
   * Ensures a users who does not provide a default sub-todo id
   * also provides a filter option
   *
   * @param subTodoId
   * @param filters
   * @param whoIs
   * @param action
   */
  private throwIfNoIdAndFilters(
    subTodoId: string,
    filters: {},
    whoIs: string,
    action: string,
  ) {
    if (!subTodoId && Object.values(filters).length === 0) {
      this.logger.log(
        `User with id ${whoIs} is trying ${action} without a sub-todo id and an alternative option other than user id`,
      )

      throw new BadRequestException(
        `Failed to ${action} a todo: Please provide an alternative filter`,
      )
    }
  }
}
