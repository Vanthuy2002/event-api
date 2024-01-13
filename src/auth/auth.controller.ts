import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthServices } from './auth.service'
import { CurrentUser } from './user.decorator'
import { User } from './user.entity'
import { AuthGuardJwt, AuthGuardLocal } from './input/authGuard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServices) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      token: this.authService.generateToken(user)
    }
  }

  @Get('whoami')
  @UseGuards(AuthGuardJwt)
  async whoAmI(@CurrentUser() user: User) {
    return user
  }
}
