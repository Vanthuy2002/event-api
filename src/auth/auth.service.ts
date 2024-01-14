import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from './entity'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { messageResponse } from 'src/utils/message'

@Injectable()
export class AuthServices {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async generateToken(
    user: User,
    expiresIn = process.env.TOKEN_EXPIRED
  ): Promise<string> {
    const payload = { sub: user.id }
    return await this.jwtService.signAsync(payload, { expiresIn })
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(2)
    const hashedString = await bcrypt.hash(password, salt)
    return hashedString
  }

  async comparePassword(password: string, hashPass: string): Promise<boolean> {
    const isMatched = await bcrypt.compare(password, hashPass)
    return isMatched
  }

  async saveRefreshToken(userId: number, refresh_token: string) {
    const result = await this.userRepo.update({ id: userId }, { refresh_token })
    if (result.affected === 0) {
      throw new NotFoundException(messageResponse.NOT_FOUND_USER)
    }
  }
}
