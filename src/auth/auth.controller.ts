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
import { HttpCodeStatus } from 'src/utils/httpStatus'
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

  @Post('logout')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpCodeStatus.NOTHING)
  async logout(@CurrentUser() user: User) {
    return await this.authService.removeRefreshToken(user.id)
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
    return await this.authService.handleRefreshToken(user['sub'])
  }
}
