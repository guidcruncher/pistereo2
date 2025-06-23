import { Injectable } from '@nestjs/common'

@Injectable()
export class BaseService {
  constructor() {}

  protected __caller() {
    try {
      return new Error().stack?.split('\n')[3]?.trim().split(' ')[1]
    } catch (e) {
      return '<<null>>'
    }
  }

  protected __function() {
    try {
      return new Error().stack?.split('\n')[2]?.trim().split(' ')[1]
    } catch (e) {
      return '<<null>>'
    }
  }
}
