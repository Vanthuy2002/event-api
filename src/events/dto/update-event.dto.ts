import { PartialType } from '@nestjs/mapped-types'
import { CreateEventDTO } from './create-event.dto'

export class UpdateEventsDTO extends PartialType(CreateEventDTO) {}
