import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { messageResponse } from 'src/utils/message'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt_refresh'
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET
    })
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies?.token) {
      return req.cookies?.token
    }
    throw new ForbiddenException(null, messageResponse.PERMISSION)
  }

  async validate(payload: any) {
    return payload
  }
}
