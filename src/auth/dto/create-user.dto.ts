import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
  @Length(5, 30)
  username: string

  @IsEmail()
  email: string

  @Length(4)
  password: string

  @Length(4)
  confirmPassword: string
}
