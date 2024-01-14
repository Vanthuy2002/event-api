import { AuthGuard } from '@nestjs/passport'

export class AuthGuardJwt extends AuthGuard('access_token') {}

export class AuthGuardLocal extends AuthGuard('local') {}

export class AuthGuardRT extends AuthGuard('refresh_token') {}
