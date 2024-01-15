import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common'
import { AuthServices } from './auth.service'
import { CurrentUser } from './decorator'
import { User } from './entity'
import { AuthGuardJwt, AuthGuardLocal, AuthGuardRT } from './guards/authGuard'
import { HttpCodeStatus } from 'src/utils/httpStatus'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServices) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    const [access_token, refresh_token] = await Promise.all([
      this.authService.generateToken(user),
      this.authService.generateToken(user, process.env.TOKEN_REFRESH_EXPIRED)
    ])
    await this.authService.saveHashToken(user.id, refresh_token)
    return {
      access_token,
      refresh_token
    }
  }

  @Post('logout')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpCodeStatus.NOTHING)
  async logout(@CurrentUser() user: User) {
    return await this.authService.removeHashToken(user.id)
  }

  @Get('whoami')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpCodeStatus.OK)
  async whoAmI(@CurrentUser() user: User) {
    return user
  }

  @Get('refresh')
  @UseGuards(AuthGuardRT)
  @HttpCode(HttpCodeStatus.OK)
  async refreshToken(@Req() req: Request) {
    const user = req.user
    return await this.authService.handleRefreshToken({
      id: user['sub'],
      token: user['refresh_token']
    })
  }
}
