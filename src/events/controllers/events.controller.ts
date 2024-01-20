import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common'
import { CreateEventDTO, UpdateEventsDTO } from '../dto'
import { EventsService } from '../services'
import { ListEvents } from '../input/event.filter'
import { Pagination, PaginationOptions } from '../input/pagination'
import { CurrentUser } from 'src/auth/decorator/user.decorator'
import { User } from 'src/auth/entity'
import { AuthGuardJwt } from 'src/auth/guards/authGuard'
import { Serializer } from 'src/interceptors/serialize'
import { Events } from '../entity'

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name)
  constructor(private readonly eventService: EventsService) {}

  @Serializer(Pagination)
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) paginate: PaginationOptions,
    @Query() filter?: ListEvents
  ) {
    this.logger.log(`Hit sent a request`)
    return this.eventService.findAll(paginate, filter)
  }

  @Serializer(Events)
  @Get('practive')
  async findWithRelation() {
    return this.eventService.getPrative()
  }

  @Serializer(Events)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findById(id)
  }

  // only work when off global validate
  // @Body(new ValidationPipe({ groups: ['create'] })) body: CreateEventDTOs
  // @Body(new ValidationPipe({ groups: ['update'] })) body: UpdateEventsDTO
  @Post('/create')
  @UseGuards(AuthGuardJwt)
  createNew(@Body() body: CreateEventDTO, @CurrentUser() user: User) {
    return this.eventService.create(body, user)
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventsDTO,
    @CurrentUser() user: User
  ) {
    return this.eventService.update(id, body, user)
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  // @HttpCode(204) defined http statucs code
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return await this.eventService.remove(id, user)
  }
}
