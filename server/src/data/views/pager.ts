export class Pager {
  offset: number

  limit: number

  total: number

  page: number

  pageCount: number

  constructor() {
    this.offset = 0
    this.limit = 0
    this.total = 0
    this.page = 0
    this.pageCount = 0
  }
}
