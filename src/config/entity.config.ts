import { Profile } from './../auth/entity/profile.entity'
import { User } from './../auth/entity/user.entity'
import { Attendee } from './../events/entity/attendee.entity'
import { Events } from './../events/entity/events.entity'
import { Subject } from './../school/subject.entity'
import { Teacher } from './../school/teacher.entity'

export const entitiesConfig = [
  Profile,
  User,
  Attendee,
  Events,
  Subject,
  Teacher
]
