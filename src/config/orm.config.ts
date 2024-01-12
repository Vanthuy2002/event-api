import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { entitiesConfig } from './entity.config'

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password:
      process.env.NODE_ENV === 'production'
        ? process.env.DB_PASSWORD_PROD
        : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: entitiesConfig,
    synchronize: process.env.NODE_ENV === 'production' ? false : true
  })
)
