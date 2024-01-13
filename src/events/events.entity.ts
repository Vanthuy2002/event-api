import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Attendee } from './attendee.entity'
import { User } from 'src/auth/user.entity'

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

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizer_id' })
  organizer: User

  @Column({ nullable: true })
  organizer_id: number

  inviteeCount?: number
  inviteeAgree?: number
  inviteeRefuse?: number
  inviteePending?: number

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
