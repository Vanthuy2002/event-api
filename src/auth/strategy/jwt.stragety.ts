import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { User } from '../entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class JwtStragety extends PassportStrategy(Strategy, 'access_token') {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET
    })
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: { id: true, username: true }
    })
    return user
  }
}
