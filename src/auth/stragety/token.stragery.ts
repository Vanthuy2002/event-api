import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export class RTStragety extends PassportStrategy(Strategy, 'refresh_token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET,
      passReqToCallBack: true
    })
  }

  validate(payload: any) {
    return payload
  }
}
