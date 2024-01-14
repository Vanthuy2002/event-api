import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
@Injectable()
export class RTStragety extends PassportStrategy(Strategy, 'refresh_token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET,
      passReqToCallBack: true
    })
  }

  validate(req: Request, payload: any) {
    const refresh_token = req.get('authorization').replace('Bearer', ' ').trim()
    return { ...payload, refresh_token }
  }
}
