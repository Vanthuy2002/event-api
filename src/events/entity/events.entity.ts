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
import { User } from '../../auth/entity'
import { Expose } from 'class-transformer'

@Entity()
export class Events {
  constructor(partial?: Partial<Events>) {
    Object.assign(this, partial)
  }
  @PrimaryGeneratedColumn()
  @Expose()
  id?: number

  @Column('varchar')
  @Expose()
  name: string

  @Column('varchar')
  @Expose()
  description: string

  @Column('varchar')
  @Expose()
  addr: string

  @Column('date')
  @Expose()
  when: Date

  @OneToMany(() => Attendee, (invite) => invite.event, { cascade: true })
  @Expose()
  invitee: Attendee[]

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizer_id' })
  @Expose()
  organizer: User

  @Column({ nullable: true })
  organizer_id: number

  @Expose()
  inviteeCount?: number
  @Expose()
  inviteeAgree?: number
  @Expose()
  inviteeRefuse?: number
  @Expose()
  inviteePending?: number

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
