import { Injectable } from '@nestjs/common'
import { TuneinSearchService } from './tunein-search.service'

@Injectable()
export class SearchService {
  async query(token: string, user: any, query: string, offset: number, limit: number) {
    return {}
  }

  async search(token: string, user: any, query: any, offset: number, limit: number) {
    return {}
  }
}
