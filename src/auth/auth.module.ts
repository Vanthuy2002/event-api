import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { LocalStragery } from './local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthServices } from './auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      signOptions: { expiresIn: process.env.TOKEN_EXPIRED },
      secret: process.env.TOKEN_SECRET
    })
  ],
  controllers: [AuthController],
  providers: [LocalStragery, AuthServices]
})
export class AuthModule {}
