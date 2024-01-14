import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthServices } from './auth.service'
import { CurrentUser } from './decorator'
import { User } from './entity'
import { AuthGuardJwt, AuthGuardLocal } from './guards/authGuard'

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
    await this.authService.saveRefreshToken(user.id, refresh_token)
    return {
      access_token,
      refresh_token
    }
  }

  @Get('whoami')
  @UseGuards(AuthGuardJwt)
  async whoAmI(@CurrentUser() user: User) {
    return user
  }
}
