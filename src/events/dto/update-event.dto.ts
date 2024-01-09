import { PartialType } from '@nestjs/mapped-types'
import { CreateEvent } from './create-event.dto'

export class UpdateEvents extends PartialType(CreateEvent) {}
