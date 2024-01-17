import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common'
import { CreateUserDto, UserDto } from './dto'
import { AuthServices } from './auth.service'
import { User } from './entity'
import { messageResponse } from 'src/utils/message'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Serializer } from 'src/interceptors/serialize'

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthServices,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException(messageResponse.NOT_MATCHED)
    }

    const existingUser = await this.userRepo.findOne({
      where: [{ username: body.username }, { email: body.email }]
    })
    if (existingUser) {
      throw new BadRequestException(messageResponse.ALREADY_USE)
    }

    const hash = await this.authService.hashString(body.password)
    const user = new User()
    user.email = body.email
    user.password = hash
    user.username = body.username
    await this.userRepo.save(user)

    return {
      message: messageResponse.REGISTER
    }
  }

  // for admin

  @Serializer(UserDto)
  @Get('admin')
  async getUserForAdmin() {
    return await this.userRepo.find({})
  }

  @Serializer(UserDto)
  @Get('admin/:id')
  async getOneUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userRepo.findOneBy({ id })
  }
}
