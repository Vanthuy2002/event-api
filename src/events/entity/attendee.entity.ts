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

export enum AttendeeAnwsers {
  Agreed = 'agree',
  Refused = 'refused',
  Pending = 'pending'
}
@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Events, (event) => event.invitee)
  @JoinColumn({
    name: 'event_id'
  })
  event: Events // Đổi tên property này thành event

  @Column({
    type: 'enum',
    enum: AttendeeAnwsers,
    default: AttendeeAnwsers.Pending
  })
  answers: AttendeeAnwsers

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
