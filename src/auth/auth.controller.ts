import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { AuthServices } from './auth.service'
import { CurrentUser } from './decorator'
import { User } from './entity'
import { AuthGuardJwt, AuthGuardLocal, AuthGuardRT } from './guards/authGuard'
import { HttpCodeStatus } from './../utils/httpStatus'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServices) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.handleLogin(user, res)
  }

  @Get('whoami')
  @UseGuards(AuthGuardJwt) // access_token
  @HttpCode(HttpCodeStatus.OK)
  async whoAmI(@CurrentUser() user: User) {
    return user
  }

  @Post('logout')
  @UseGuards(AuthGuardRT) // refresh_token
  @HttpCode(HttpCodeStatus.NOTHING)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user
    const result = await this.authService.logoutUser(user['sub'])
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' })
    return result
  }

  @Get('refresh')
  @UseGuards(AuthGuardRT) // refresh_token
  @HttpCode(HttpCodeStatus.OK)
  async refreshToken(@Req() req: Request) {
    const user = req.user
    return await this.authService.handleRefreshToken(user['sub'])
  }
}
