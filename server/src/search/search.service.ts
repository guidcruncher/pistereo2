import { Injectable } from '@nestjs/common'
import { TuneinSearchService } from './tunein-search.service'

@Injectable()
export class SearchService {
  constructor(private readonly tuneinSearchService: TuneinSearchService) {}

  async query(token: string, user: any, query: string, offset: number, limit: number) {
    return await this.tuneinSearchService.search(query, offset, limit)
  }

  async search(token: string, user: any, query: any, offset: number, limit: number) {
    return {}
  }
}
