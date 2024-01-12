import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from './user.entity'

@Injectable()
export class AuthServices {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User) {
    const payload = { sub: user.id }
    return this.jwtService.sign(payload)
  }
}
