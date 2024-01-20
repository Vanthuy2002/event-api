import { Module } from '@nestjs/common'
import { EventsService } from './events.service'
import { EventsController } from './events.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Events } from './entity/events.entity'
import { Attendee } from './entity/attendee.entity'
import { AnttendeeController } from './anttendee.controller'
import { AnttendeeService } from './anttendee.service'

@Module({
  imports: [TypeOrmModule.forFeature([Events, Attendee])],
  controllers: [EventsController, AnttendeeController],
  providers: [EventsService, AnttendeeService]
})
export class EventsModule {}
