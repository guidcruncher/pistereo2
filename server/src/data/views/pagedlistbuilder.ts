import { Mapper } from '../mappers/mapper'
import { PagedList, Pager } from './index'

export class PagedListBuilder {
  static fromArray<TOut>(
    items: any[],
    offset: number,
    limit: number,
    mapper: Mapper<TOut>,
  ): PagedList<TOut> {
    const l = new PagedList<TOut>()
    l.paging.offset = parseInt(offset.toString())
    l.paging.limit = parseInt(limit.toString())
    l.paging.total = items.length
    l.paging.page = 0

    l.paging.pageCount = Math.ceil(items.length / l.paging.limit)
    l.paging.page = (l.paging.offset == 0 ? 0 : l.paging.offset / l.paging.limit) + 1
    const end: number = l.paging.offset + l.paging.limit
    l.items = []
    for (let i = offset; i < end; i++) {
      if (items[i]) {
        l.items.push(mapper(items[i]))
      }
    }
    return l
  }

  static fromMappedArray<TOut>(items: TOut[], offset: number, limit: number): PagedList<TOut> {
    const l = new PagedList<TOut>()
    l.paging.offset = parseInt(offset.toString())
    l.paging.limit = parseInt(limit.toString())
    l.paging.total = items.length
    l.paging.page = 0

    l.paging.pageCount = Math.ceil(items.length / l.paging.limit)
    l.paging.page = (l.paging.offset == 0 ? 0 : l.paging.offset / l.paging.limit) + 1
    const end: number = l.paging.offset + l.paging.limit
    l.items = []
    for (let i = offset; i < end; i++) {
      if (items[i]) {
        l.items.push(items[i])
      }
    }
    return l
  }

  static fromPagedObject<TOut>(obj: any, mapper: Mapper<TOut>, itemProp = '') {
    return PagedListBuilder.fromPagedArray<TOut>(
      obj.items,
      obj.offset,
      obj.limit,
      obj.total,
      mapper,
      itemProp,
    )
  }

  static fromPagedArray<TOut>(
    items: any[],
    offset: number,
    limit: number,
    total: number,
    mapper: Mapper<TOut>,
    itemProp = '',
  ): PagedList<TOut> {
    const l = new PagedList<TOut>()
    l.paging = new Pager()
    l.paging.offset = offset
    l.paging.limit = limit
    l.paging.total = total
    l.paging.page = 0
    l.paging.pageCount = Math.ceil(total / l.paging.limit)
    l.paging.page = (l.paging.offset == 0 ? 0 : l.paging.offset / l.paging.limit) + 1
    items.forEach((item) => {
      if (itemProp && itemProp != '') {
        if (item[itemProp] && item[itemProp].uri) {
          l.items.push(mapper(item[itemProp]))
        }
      } else {
        if (item) {
          l.items.push(mapper(item))
        }
      }
    })
    return l
  }
}
