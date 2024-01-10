import { Inject } from '@nestjs/common'

export class AppJapanService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string
  ) {}
  getHello(): string {
    return `こんにちは, use method in another service ${this.name} and send by factory ${this.message}`
  }
}
