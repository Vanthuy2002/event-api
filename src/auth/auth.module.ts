import { UserController } from './user.controller'
import { User } from './entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { JwtStragety, LocalStragery, RTStragety } from './stragety'
import { JwtModule } from '@nestjs/jwt'
import { AuthServices } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.TOKEN_SECRET
      })
    })
  ],
  controllers: [AuthController, UserController],
  providers: [LocalStragery, AuthServices, JwtStragety, RTStragety]
})
export class AuthModule {}
