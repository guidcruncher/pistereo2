import { Pager } from './pager'

export class PagedList<T> {
  paging: Pager

  items: T[]

  constructor() {
    this.paging = new Pager()
    this.items = [] as T[]
  }
}
