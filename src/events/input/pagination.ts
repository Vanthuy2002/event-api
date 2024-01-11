import { SelectQueryBuilder } from 'typeorm'

export interface PaginationOptions {
  page: string
  limit: string
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
  const PAGE = parseInt(options.page)
  const LIMIT = parseInt(options.limit)

  const offset = (PAGE - 1) * LIMIT
  const [data, count] = await Promise.all([
    handler.offset(offset).limit(LIMIT).getMany(),
    handler.getCount()
  ])

  const total_pages = Math.ceil(count / LIMIT)

  return {
    data,
    page: PAGE,
    limit: LIMIT,
    total: count,
    total_pages
  }
}
