import { IsDateString, IsString, Length } from 'class-validator'

export class CreateEventDTO {
  @Length(5, 255)
  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  // @Length(5, 255, { groups: ['create'] }) => mean when create , length must be > 5, < 255
  // @Length(5, 10, { groups: ['update'] }) => mean when update, length must be > 5, < 10
  addr: string

  @IsDateString()
  when: string
}
