import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe
} from '@nestjs/common'
import { EventsService } from '../services'
import { Pagination, PaginationOptions } from '../input/pagination'
import { Serializer } from '../../interceptors/serialize'

@Controller('events-oganizers/:id')
export class EventOganizerController {
  constructor(private readonly eventService: EventsService) {}

  @Serializer(Pagination)
  @Get()
  async findAll(
    @Param('id', ParseIntPipe) id: number,
    @Query(new ValidationPipe({ transform: true })) paginate: PaginationOptions
  ) {
    return await this.eventService.getEventOganizerByUserIdPagination(
      id,
      paginate
    )
  }
}
