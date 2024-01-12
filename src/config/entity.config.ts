import { Profile } from 'src/auth/profile.entity'
import { User } from 'src/auth/user.entity'
import { Attendee } from 'src/events/attendee.entity'
import { Events } from 'src/events/events.entity'
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
