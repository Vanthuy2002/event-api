import { Module } from '@nestjs/common'
import { AnttendeeService, EventsService } from './services'
import {
  AnttendeeController,
  EventOganizerController,
  EventsController
} from './controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Events, Attendee } from './entity'

@Module({
  imports: [TypeOrmModule.forFeature([Events, Attendee])],
  controllers: [EventsController, AnttendeeController, EventOganizerController],
  providers: [EventsService, AnttendeeService]
})
export class EventsModule {}
