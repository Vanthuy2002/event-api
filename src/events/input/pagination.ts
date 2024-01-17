import { SelectQueryBuilder } from 'typeorm'

export interface PaginationOptions {
  page: number
  limit: number
}

export interface Pagination<T> {
  limit: number
  page: number
  total: number
  total_pages: number
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

  return {
    data,
    page: options.page,
    limit: options.limit,
    total: count,
    total_pages
  }
}
