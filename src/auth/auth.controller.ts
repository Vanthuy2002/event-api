import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthServices } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServices) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request) {
    return {
      token: this.authService.generateToken(request.user)
    }
  }
}
