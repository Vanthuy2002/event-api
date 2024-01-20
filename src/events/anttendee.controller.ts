import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { AnttendeeService } from './anttendee.service'

@Controller('events/:id/anttendee')
export class AnttendeeController {
  constructor(private readonly anttendeeServices: AnttendeeService) {}

  @Get()
  async findEvents(@Param('id', ParseIntPipe) id: number) {
    return await this.anttendeeServices.findEventByIds(id)
  }
}
