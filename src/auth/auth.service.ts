import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from './user.entity'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthServices {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User) {
    const payload = { sub: user.id }
    return this.jwtService.sign(payload)
  }

  async hashPassword(password: string): Promise<string> {
    const salt = 5
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  async comparePassword(password: string, hashPass: string): Promise<boolean> {
    const isMatched = await bcrypt.compare(password, hashPass)
    return isMatched
  }
}
