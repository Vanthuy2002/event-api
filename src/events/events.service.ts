import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Events } from './events.entity'
import { FindOptionsSelect, Repository } from 'typeorm'
import { UpdateEventsDTO } from './dto/update-event.dto'
import { CreateEventDTO } from './dto/create-event.dto'
import { messageResponse } from 'src/utils/message'
import { Attendee } from './attendee.entity'

const inCludeFields = ['name', 'addr', 'id', 'description', 'invitee']

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events) private readonly repo: Repository<Events>,
    @InjectRepository(Attendee)
    private readonly attendeRepo: Repository<Attendee>
  ) {}

  async findAll() {
    const events = await this.repo.find({
      select: inCludeFields as FindOptionsSelect<Events>
    })
    return {
      message: messageResponse.GET_ALL_EVENT,
      events
    }
  }

  async findById(id: number) {
    const event = await this.repo.findOne({
      where: { id },
      select: inCludeFields as FindOptionsSelect<Events>
    })
    if (!event) {
      throw new NotFoundException(messageResponse.NOT_FOUND__EVENT)
    }
    return {
      message: messageResponse.GET_ONE_EVENT,
      event
    }
  }

  async create(body: CreateEventDTO) {
    const newEvent = await this.repo.save(body)
    return {
      message: messageResponse.CREATED_EVENT,
      event: newEvent
    }
  }

  async update(id: number, body: UpdateEventsDTO) {
    await this.repo.update(id, { ...body })
    return {
      message: messageResponse.UPDATED_EVENT
    }
  }

  async remove(id: number) {
    await this.repo.delete(id)
    return {
      message: messageResponse.REMOVE_EVENT
    }
  }

  async getPrative() {
    const event = await this.repo.findOne({
      where: { id: 1 },
      relations: ['invitee']
    })

    const attendee = new Attendee()
    attendee.name = 'Using Cascade'
    event.invitee.push(attendee)
    await this.repo.save(event)

    return event
  }
}
