import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Repository } from 'typeorm'
import { User } from '../entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { messageResponse } from 'src/utils/message'
import { AuthServices } from '../auth.service'

@Injectable()
export class LocalStragery extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthServices
  ) {
    super()
  }
  private readonly logger = new Logger(LocalStragery.name)

  private async getUser(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      select: { username: true, password: true, id: true }
    })
    if (!user) {
      this.logger.debug(`User ${username} not found!`)
      throw new UnauthorizedException(messageResponse.NOT_CORRECT)
    }
    return user
  }

  async validate(username: string, password: string) {
    const user = await this.getUser(username)
    const isMatched = await this.authService.compareString(
      password,
      user.password
    )
    if (!isMatched) {
      this.logger.debug(`Password not correct`)
      throw new UnauthorizedException(messageResponse.NOT_CORRECT)
    }

    return user
  }
}
