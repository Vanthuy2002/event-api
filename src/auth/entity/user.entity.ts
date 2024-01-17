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
import { Events } from 'src/events/entity/events.entity'
import { Expose } from 'class-transformer'

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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
