import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { CreateEvent } from './dto/create-event.dto'
import { UpdateEvents } from './dto/update-event.dto'

@Controller('events')
export class EventsController {
  @Get()
  findAll() {}

  @Get(':id')
  findById() {}

  @Post('/create')
  createNew(@Body() body: CreateEvent) {
    return body
  }

  @Patch(':id')
  updateOne(@Param() id: string, @Body() body: UpdateEvents) {
    return { id, body }
  }

  @Delete('id')
  @HttpCode(204)
  remove() {}
}
