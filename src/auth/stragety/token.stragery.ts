import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET,
      passReqToCallback: true
    })
  }

  validate(req: Request, payload: any) {
    const refresh_token = req.get('Authorization').replace('Bearer', '').trim()
    const user = { ...payload, refresh_token }
    return user
  }
}
