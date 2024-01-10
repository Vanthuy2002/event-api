## Custom Services in Nestjs

```ts
providers: [
  {
    provide: AppService,
    useClass: AppJapanService
  }
]
```

- use `AppService` in `AppController`, but use method `getHello()` in class `AppJapanService`
  two class must be same name method, here is `getHello()`

```ts
providers: [
  {
    provide: AppService,
    useClass: AppJapanService
  },
  {
    provide: 'APP_NAME',
    useValue: 'NEST CUSTOM SERVICES'
  }
]
```

- `APP_NAME` is value , would be reference to `AppJapanServices`
- `useValue` will be return value to use in contructor

```js
 // AppJanpansesServices
 export class AppJapanService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string
  ) {}
  getHello(): string {
    return `こんにちは, use method in another service ${this.name}`
  }
}
```

```ts
// AppServices
@Injectable()
export class AppService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string
  ) {}
  getHello(): string {
    return `HELLO WORLD BY ${this.name}`
  }
}
```

- name will be has value is `NEST CUSTOM SERVICES`, and use method in `AppJapanSevices`

```ts
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
```

```ts
export class AppDummy {
  dummy(): string {
    return 'dummy factory'
  }
}

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
```

- Create a fake class `AppDummy`, make sure this is a standard service class, but without dependency injection, assign it to providers, then assign it to the `inject` field with provide as `MESSAGE`
- `useFactory` get a parameter , this params is return all method in `AppDummy`, and you can see at this example
- Make sure `@Inject` in `AppJapanServices` to use method, variable `message` will be has value retutn by method `dummy()` in `AppDummy` class
