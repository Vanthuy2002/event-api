import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { LocalStragery } from './local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthServices } from './auth.service'
import { JwtStragety } from './jwt.stragety'
import { UserController } from './user.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        signOptions: { expiresIn: process.env.TOKEN_EXPIRED },
        secret: process.env.TOKEN_SECRET
      })
    })
  ],
  controllers: [AuthController, UserController],
  providers: [LocalStragery, AuthServices, JwtStragety]
})
export class AuthModule {}
