import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Attendee } from './attendee.entity'

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  name: string

  @Column('varchar')
  description: string

  @Column('varchar')
  addr: string

  @Column('date')
  when: Date

  @OneToMany(() => Attendee, (invite) => invite.event, { cascade: true })
  invitee: Attendee[]

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
