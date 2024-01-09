import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common'
import { CreateEvent } from './dto/create-event.dto'
import { UpdateEvents } from './dto/update-event.dto'
import { EventsService } from './events.service'

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}
  @Get()
  findAll() {
    return this.eventService.findAll()
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findById(id)
  }

  @Post('/create')
  createNew(@Body() body: CreateEvent) {
    return this.eventService.create(body)
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() body: UpdateEvents) {
    return this.eventService.update(+id, body)
  }

  @Delete(':id')
  // @HttpCode(204) defined http statucs code
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id)
  }
}
