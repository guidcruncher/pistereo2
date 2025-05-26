import { Logger } from '@nestjs/common'
import { Injectable, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.DEFAULT })
export class AppService {
  constructor() {}
}
