import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Events } from './events.entity'
import { Repository } from 'typeorm'
import { UpdateEvents } from './dto/update-event.dto'
import { CreateEvent } from './dto/create-event.dto'
import { messageResponse } from 'src/utils/message'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events) private readonly repo: Repository<Events>
  ) {}

  async findAll() {
    const events = await this.repo.find({})
    return {
      message: messageResponse.GET_ALL_EVENT,
      events
    }
  }

  async findById(id: number) {
    const event = await this.repo.findOneBy({ id })
    return {
      message: messageResponse.GET_ONE_EVENT,
      event
    }
  }

  async create(body: CreateEvent) {
    const newEvent = await this.repo.save(body)
    return {
      message: messageResponse.CREATED_EVENT,
      event: newEvent
    }
  }

  async update(id: number, body: UpdateEvents) {
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
}
