import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventsModule } from 'src/events'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Events } from 'src/events/events.entity'
import { AppJapanService } from './app.japanese'
import { AppDummy } from './app.dummy'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      port: 5432,
      password: 'example',
      database: 'nest-events',
      entities: [Events],
      synchronize: true
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
