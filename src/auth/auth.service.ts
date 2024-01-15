import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
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
    const hashedString = await bcrypt.hash(password, 2)
    return hashedString
  }

  async comparePassword(password: string, hashPass: string): Promise<boolean> {
    const isMatched = await bcrypt.compare(password, hashPass)
    return isMatched
  }

  async saveHashToken(userId: number, refresh_token: string) {
    const hashRt = await this.hashPassword(refresh_token)
    const result = await this.userRepo.update(
      { id: userId },
      { refresh_token: hashRt }
    )
    if (result.affected === 0) {
      throw new NotFoundException(messageResponse.NOT_FOUND_USER)
    }
  }

  async removeHashToken(id: number) {
    // remove access_token in client first
    // remove refresh_token in DB
    const result = await this.userRepo.update({ id }, { refresh_token: null })
    if (result.affected === 0)
      throw new ForbiddenException(null, messageResponse.PERMISSION)
  }
}
