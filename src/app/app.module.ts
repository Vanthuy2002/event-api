import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventsModule } from 'src/events'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppJapanService } from './app.japanese'
import { AppDummy } from './app.dummy'
import { ConfigModule } from '@nestjs/config'
import ormConfig from 'src/config/orm.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    EventsModule
  ],

  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService
    },
    {
      provide: 'APP_NAME',
      useValue: 'NEST CUSTOM SERVICES'
    },
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => app.dummy()
    },
    AppDummy
  ]
})
export class AppModule {}
