import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Events } from './events.entity'
import { DeleteResult, Repository } from 'typeorm'
import { UpdateEventsDTO } from './dto/update-event.dto'
import { CreateEventDTO } from './dto/create-event.dto'
import { messageResponse } from 'src/utils/message'
import { Attendee, AttendeeAnwsers } from './attendee.entity'
import { ListEvents, WhenEventFilter } from './input/event.filter'
import { PaginationOptions, paginateHandler } from './input/pagination'

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)
  constructor(
    @InjectRepository(Events) private readonly repo: Repository<Events>
  ) {}

  private getEventBaseQuery() {
    return this.repo.createQueryBuilder('e').orderBy('e.id', 'DESC')
  }

  private getEventsWithAttendeeCount() {
    return this.getEventBaseQuery()
      .loadRelationCountAndMap('e.inviteeCount', 'e.invitee') // count all invitee
      .loadRelationCountAndMap(
        'e.inviteeAgree', // virtual colum
        'e.invitee', // foreign key column
        'inviteeRes', // alias name
        (qb) =>
          qb.where('inviteeRes.answers = :answers', {
            answers: AttendeeAnwsers.Agreed
          })
      ) // count invitee agreed
      .loadRelationCountAndMap(
        'e.inviteePending',
        'e.invitee',
        'inviteeRes',
        (qb) =>
          qb.where('inviteeRes.answers = :answers', {
            answers: AttendeeAnwsers.Pending
          })
      )
  }

  private getEventCountAttendeeFilterd(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCount()
    if (!filter) return query

    if (filter.when === WhenEventFilter.TODAY) {
      query = query.andWhere(
        `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
      )
    }

    if (filter.when === WhenEventFilter.TOMORROW) {
      query = query.andWhere(
        `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
      )
    }

    if (filter.when === WhenEventFilter.THISWEEK) {
      query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`)
    }

    if (filter.when === WhenEventFilter.NEXTWEEK) {
      query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`)
    }
    return query
  }

  async getEventPagination(paginate: PaginationOptions, filter: ListEvents) {
    return await paginateHandler(
      this.getEventCountAttendeeFilterd(filter),
      paginate
    )
  }

  async findAll(paginate: PaginationOptions, filter?: ListEvents) {
    const events = await this.getEventPagination(paginate, filter)
    return events
  }

  async findById(id: number): Promise<Events> {
    const query = this.getEventsWithAttendeeCount().andWhere('e.id = :id', {
      id
    })
    this.logger.debug(query.getSql())
    const event = await query.getOne()
    return event
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

  async remove(id: number): Promise<DeleteResult> {
    const results = await this.repo
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute()

    if (results.affected === 0)
      throw new NotFoundException(messageResponse.NOT_FOUND__EVENT)

    return results
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
