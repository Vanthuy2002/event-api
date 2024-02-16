import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Profile } from './profile.entity'
import { Events } from '../../events/entity/events.entity'
import { Expose } from 'class-transformer'
import { Attendee } from '../../events/entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ unique: true })
  @Expose()
  username: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  refresh_token: string

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile

  @OneToMany(() => Events, (event) => event.organizer)
  @Expose()
  organized: Events[]

  @OneToMany(() => Attendee, (att) => att.user)
  atendeed: Attendee[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
