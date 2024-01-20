import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Events } from './events.entity'
import { User } from 'src/auth/entity'
import { Expose } from 'class-transformer'

export enum AttendeeAnwsers {
  Agreed = 'agree',
  Refused = 'refused',
  Pending = 'pending'
}
@Entity()
export class Attendee {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Expose()
  name: string

  @ManyToOne(() => Events, (event) => event.invitee)
  @JoinColumn({
    name: 'event_id'
  })
  @Expose()
  event: Events // Đổi tên property này thành event

  @Column({
    type: 'enum',
    enum: AttendeeAnwsers,
    default: AttendeeAnwsers.Pending
  })
  @Expose()
  answers: AttendeeAnwsers

  @ManyToOne(() => User, (user) => user.atendeed)
  @Expose()
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
