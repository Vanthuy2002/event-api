import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthServices } from './auth.service'
import { CurrentUser } from './user.decorator'
import { User } from './user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServices) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: User) {
    return {
      token: this.authService.generateToken(user)
    }
  }

  @Get('whoami')
  @UseGuards(AuthGuard('jwt'))
  async whoAmI(@CurrentUser() user: User) {
    return user
  }
}
