import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

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

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
