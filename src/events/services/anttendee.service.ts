import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Attendee } from '../entity'
import { Repository } from 'typeorm'

@Injectable()
export class AnttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly repository: Repository<Attendee>
  ) {}

  async findEventByIds(eventId: number): Promise<Attendee[]> {
    const events = await this.repository.find({
      where: { event: { id: eventId } }
    })
    return events
  }
}
