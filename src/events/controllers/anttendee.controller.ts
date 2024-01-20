import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { AnttendeeService } from '../services'
import { Serializer } from 'src/interceptors/serialize'
import { Attendee } from '../entity'

@Controller('events/:id/anttendee')
export class AnttendeeController {
  constructor(private readonly anttendeeServices: AnttendeeService) {}

  @Serializer(Attendee)
  @Get()
  async findEvents(@Param('id', ParseIntPipe) id: number) {
    return await this.anttendeeServices.findEventByIds(id)
  }
}
