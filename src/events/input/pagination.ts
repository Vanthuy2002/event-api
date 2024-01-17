import { Expose } from 'class-transformer'
import { SelectQueryBuilder } from 'typeorm'

export interface PaginationOptions {
  page: number
  limit: number
}

export class Pagination<T> {
  constructor(partial: Partial<Pagination<T>>) {
    Object.assign(this, partial)
  }
  @Expose()
  limit: number
  @Expose()
  page: number
  @Expose()
  total: number
  @Expose()
  total_pages: number
  @Expose()
  data: T[]
}

export async function paginateHandler<T>(
  handler: SelectQueryBuilder<T>,
  options: PaginationOptions
): Promise<Pagination<T>> {
  const offset = (options.page - 1) * options.limit
  const [data, count] = await Promise.all([
    handler.offset(offset).limit(options.limit).getMany(),
    handler.getCount()
  ])

  const total_pages = Math.ceil(count / options.limit)

  return new Pagination({
    data,
    page: options.page,
    limit: options.limit,
    total: count,
    total_pages
  })
}
