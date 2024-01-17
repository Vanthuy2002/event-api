import { Profile } from 'src/auth/entity/profile.entity'
import { User } from 'src/auth/entity/user.entity'
import { Attendee } from 'src/events/entity/attendee.entity'
import { Events } from 'src/events/entity/events.entity'
import { Subject } from 'src/school/subject.entity'
import { Teacher } from 'src/school/teacher.entity'

export const entitiesConfig = [
  Profile,
  User,
  Attendee,
  Events,
  Subject,
  Teacher
]
