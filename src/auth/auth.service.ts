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
import { Response } from 'express'

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

  async hashString(password: string): Promise<string> {
    const hashed = await bcrypt.hash(password, 2)
    return hashed
  }

  async compareString(password: string, hashPass: string): Promise<boolean> {
    const isMatched = await bcrypt.compare(password, hashPass)
    return isMatched
  }

  async handleLogin(user: User, res: Response) {
    const [access_token, refresh_token] = await Promise.all([
      this.generateToken(user),
      this.generateToken(user, process.env.TOKEN_REFRESH_EXPIRED)
    ])
    await this.saveRefreshToken(user.id, refresh_token)
    res.cookie('token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000)
    })

    return {
      access_token,
      refresh_token
    }
  }

  async saveRefreshToken(userId: number, refresh_token: string) {
    const result = await this.userRepo.update({ id: userId }, { refresh_token })
    if (result.affected === 0) {
      throw new NotFoundException(messageResponse.NOT_FOUND_USER)
    }
  }

  async logoutUser(id: number) {
    // remove access_token in client first
    // remove refresh_token in DB
    const result = await this.userRepo.update({ id }, { refresh_token: null })
    if (result.affected === 0)
      throw new ForbiddenException(null, messageResponse.PERMISSION)
  }

  async handleRefreshToken(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: { id: true, username: true }
    })
    if (!user) throw new ForbiddenException(null, messageResponse.PERMISSION)
    const access_token = await this.generateToken(user)
    return { access_token }
  }
}
