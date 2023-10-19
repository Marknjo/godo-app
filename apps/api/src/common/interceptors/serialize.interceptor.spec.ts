import { SerializeInterceptor } from './serialize.interceptor'
import { Reflector } from '@nestjs/core'

type TMockReflector = Record<keyof Reflector, jest.Mock>

describe('SerializeInterceptor', () => {
  const reflector: TMockReflector = {
    get: jest.fn(),
    getAll: jest.fn(),
    getAllAndMerge: jest.fn(),
    getAllAndOverride: jest.fn(),
  }

  it('should be defined', () => {
    expect(new SerializeInterceptor(reflector)).toBeDefined()
  })
})
