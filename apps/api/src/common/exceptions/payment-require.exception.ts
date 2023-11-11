import { HttpException, HttpExceptionOptions } from '@nestjs/common'

export class PaymentRequiredException extends HttpException {
  constructor(
    message: string = 'Payment required',
    options: HttpExceptionOptions = {},
  ) {
    super(message, 402, {
      cause: 'Payments',
      description: 'User is required to upgrade the account',
      ...options,
    })
  }
}
