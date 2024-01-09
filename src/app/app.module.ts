import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventsModule } from 'src/events'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Events } from 'src/events/events.entity'

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
  providers: [AppService]
})
export class AppModule {}
