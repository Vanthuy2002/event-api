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
  UseGuards
} from '@nestjs/common'
import { CreateEventDTO } from './dto/create-event.dto'
import { UpdateEventsDTO } from './dto/update-event.dto'
import { EventsService } from './events.service'
import { ListEvents } from './input/event.filter'
import { PaginationOptions } from './input/pagination'
import { CurrentUser } from 'src/auth/user.decorator'
import { User } from 'src/auth/user.entity'
import { AuthGuardJwt } from 'src/auth/input/authGuard'

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name)
  constructor(private readonly eventService: EventsService) {}
  @Get()
  findAll(@Query() paginate: PaginationOptions, @Query() filter?: ListEvents) {
    this.logger.log(`Hit sent a request`)
    return this.eventService.findAll(paginate, filter)
  }

  @Get('practive')
  async findWithRelation() {
    return this.eventService.getPrative()
  }

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
  updateOne(@Param('id') id: string, @Body() body: UpdateEventsDTO) {
    return this.eventService.update(+id, body)
  }

  @Delete(':id')
  // @HttpCode(204) defined http statucs code
  async remove(@Param('id') id: string) {
    return await this.eventService.remove(+id)
  }
}
