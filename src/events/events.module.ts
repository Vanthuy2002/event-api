import { Module } from '@nestjs/common'
import { EventsService } from './events.service'
import { EventsController } from './events.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Events } from './events.entity'
import { Attendee } from './attendee.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Events, Attendee])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
