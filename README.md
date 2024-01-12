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

## Working with RelationShip in TypeORM

### OneToMany

```ts
  async getPrative() {
    const event = await this.repo.findOne({
      where: { id: 1 },
      relations: ['invitee']
    })

    const attendee = new Attendee()
    attendee.name = 'Using Cascade'
    event.invitee.push(attendee)
    await this.repo.save(event)

    return event
  }
```

- First, get the event has `id = 1`, and we wil get all data of relationship between 2 table is `events` and `attendee`. With forgein keys is `invitee` fields. And then, we will create an instances of `Attendee` , give it some value, push it in `invitee` array, finally to save it `event`. And don't forget set `cascade` in `EventEntity` , fields `@OneToMany(.., {cascade: true})`

- Way two, simply , create new instances `Attendee`, find `event` want to assign to `attendee` instances, give it some value, and call `attendeeRepo` to save it, like this:

```ts
async getPrative() {
  const event = await this.repo.findOneBy({id : 1})

  const attendee = new Attendee()
  attendee.name = 'Using Cascade'
  attendee.event = event

  await this.attendeRepo.save(attendee)
  return event
  }
```

### Many to Many

- updating....

## Query Builder

### Introduction

```ts
// defined a method (SQL is Query CMD)
private getEventBaseQuery() {
    return this.repo.
    createQueryBuilder('e').
    orderBy('e.id', 'DESC')
}

// using
async findById(id: number): Promise<Events> {
    const query = this.getEventBaseQuery().andWhere('e.id = :id', { id })
    this.logger.debug(query.getSql())
    const event = await query.getOne()
    return event
}
```

- First, defined a query method to use for query, This method is built on `queryBuilder`, used to execute queries, and it is reusable in many places. Returns a method that enters an `e` parameter, representing the `collection name`, using the orderBy method to sort them

- To using and find a record, we proceed to call the method just initialized, call the method `andWhere` to receive the `parameter` as the `condition to find`, this is condition `WHERE` in `SQL`,then call the `getOne() `function to retrieve the most matching record. `this.logger.debug(query.getSql())` this function to log the S`QL comand in console`

### Using queryBuilder with RelationShip

```ts
// definde method
getEventsWithAttendeeCount() {
  return this.getEventBaseQuery().
    loadRelationCountAndMap(
      'e.inviteeCount',
      'e.invitee'
    )
  }

// using
async findById(id: number): Promise<Events> {
  const query = this.getEventsWithAttendeeCount().
  andWhere('e.id = :id', { id })
  const event = await query.getOne()
  return event
}
```

- First, we define a method to use call this is `getEventAndCountAttendee`, using `getEventBaseQuery` we defined last, call method `loadRelationCountAndMap`, this method enter `two parameters` or `four`, 1 is the column where we will `render the total number of invitee`, 2 is the` Forgein key column`, or the `column has a relationship`
- And we must update `EventEntity`, like this :

```ts
 @OneToMany(() => Attendee,
 (invite) => invite.event, { cascade: true })
  invitee: Attendee[]

  inviteeCount?: number
```

- We add a new field in `EventEntity`, make sure not add `@Column` in this field, it acts as a `virtual column` to give temporary data in the query. Output query like this :

```json
{
  "id": 1,
  "name": "Team Meetup",
  "description": "Let's meet together.",
  "addr": "Office St 120",
  "when": "2021-02-15",
  "inviteeCount": 6
}
```

### More example with queryBuilder

```ts
getEventsWithAttendeeCount() {
  return this.getEventBaseQuery()
    .loadRelationCountAndMap(
      'e.inviteeCount', 'e.invitee'
    ) // count all invitee
    .loadRelationCountAndMap(
      'e.inviteeAgree', // virtual colum
      'e.invitee', // foreign key column
      'inviteeRes', // alias name
      (qb) =>
        qb.where('inviteeRes.answers = :answers', {
          answers: AttendeeAnwsers.Agreed
        })
      )} // count invitee agreed
```

- We can combine multiple queries in the same `queryBuilder` command . As in the example above, we've found the `total number of guests` and the total number of guests who have `agreed to participate`. This query uses `4 parameters` in the `loadRelationCountAndMap` function, `1 and 2 like the example above`, the `3rd parameter is the alias name` of that table, parameter 4 is the `function to query by condition`

- Wil be return like this:

```json
{
  "id": 2,
  "name": "Workshop",
  "description": "Let's learn something.",
  "addr": "Workshop St 80",
  "when": "2021-02-17",
  "inviteeCount": 3,
  "inviteeAgree": 1
}
```

### Filter data using queryBuilde

```ts
async getEventCountAttendeeFilterd(filter?: ListEvents) {
  let query = this.getEventsWithAttendeeCount()
  if (!filter) return await query.getMany()

  if (filter.when === WhenEventFilter.TODAY) {
    query = query.andWhere(
      `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
    )
  }

  if (filter.when === WhenEventFilter.TOMORROW) {
    query = query.andWhere(
      `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
    )
  }

  if (filter.when === WhenEventFilter.THISWEEK) {
    query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`)
  }

  if (filter.when === WhenEventFilter.NEXTWEEK) {
    query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`)
  }
  return await query.getMany()
}
```

### Pagination with Query Builder

```ts
import { SelectQueryBuilder } from 'typeorm'

export interface PaginationOptions {
  page: string
  limit: string
}

export interface Pagination<T> {
  limit: number
  page: number
  total: number
  total_pages: number
  data: T[]
}

export async function paginateHandler<T>(
  handler: SelectQueryBuilder<T>,
  options: PaginationOptions
): Promise<Pagination<T>> {
  const PAGE = parseInt(options.page)
  const LIMIT = parseInt(options.limit)

  const offset = (PAGE - 1) * LIMIT
  const [data, count] = await Promise.all([
    handler.offset(offset).limit(LIMIT).getMany(),
    handler.getCount()
  ])

  const total_pages = Math.ceil(count / LIMIT)

  return {
    data,
    page: PAGE,
    limit: LIMIT,
    total: count,
    total_pages
  }
}
```

- First , let defined method call `paginate()` to handle this logic pagination. This function takes in `2 parameters`, 1 is another function that `handles` `querying` data under the database, then `pagination`, `limiting` the data that can be returned, the second is options for fractions page, the `first parameter` will rely on the options of the `2nd parameter` to conduct pagination

```ts
// events.services.ts
async getEventPagination(
  paginate: PaginationOptions, filter: ListEvents) {
    return await paginateHandler(
      this.getEventCountAttendeeFilterd(filter),
      paginate
    )
}

 async findAll(
  paginate: PaginationOptions, filter?: ListEvents) {
  const events = await this.getEventPagination(
    paginate, filter
  )
  return events
}

// need change some logic in getEventCountAttendeeFilterd()
 private getEventCountAttendeeFilterd(filter?: ListEvents){
    let query = this.getEventsWithAttendeeCount()
    if (!filter) return query

    if(filter.when === ...)
    return query
}

// events.controller.ts
@Get()
findAll(
@Query() paginate: PaginationOptions,
@Query() filter?: ListEvents
) {
  this.logger.log(`Hit sent a request`)
  return this.eventService.findAll(paginate, filter)
}
```

- Let see, method `getEventCountAttendeeFilterd()` now just return query: SelectQueryBuilder to run in method `paginate()`

### Update, Remove, Insert Relation with QueryBuilder

```ts
// remove
async remove(id: number): Promise<DeleteResult> {
  const results = await this.repo
    .createQueryBuilder('e')
    .delete()
    .where('id = :id', { id })
    .execute()

  if (results.affected === 0)
    throw new NotFoundException(
  messageResponse.NOT_FOUND_EVENT
  )
  return results
}
```

- Create a method `createQueryBuilder()`, call method `delete()`, find with cond `where()` and `execute()` it. Call `execute()`, will be return `DeleteResult`, based on that, we can know the `number of affected columns`, whether to delete the original intent or not

```ts
// update
public async removingRelation() {
  return await this.subjectRepository
    .createQueryBuilder('s')
    .update()
    .set({ name: 'Confidential' })
    .execute()
}
```

- We create the method as above, replace `delete()` with `update()`, call the set method to `update the data`, then call `execute()` to check the effect.

```ts
// insert will relation
// we createQueryBuilder to assign ONE `subject` to TWO `teachers

// one subject can have alot of teachers
// one teacher can teach many subject

public async savingRelation() {
  // get subject, teachers
  const [subject, teacher1, teacher2] = await Promise.all([
    this.subjectRepository.findOne({ where: { id: 5 } }),
    this.teacherRepository.findOne({ where: { id: 1 } }),
    this.teacherRepository.findOne({ where: { id: 2 } })
  ])
  return await this.subjectRepository
    .createQueryBuilder()
    .relation(Subject, 'teachers') //name Entity and tables relations
    .of(subject) // refrence to data Entity
    .add([teacher1, teacher2]) // add data
}
```

- Find `subject` and `teachers` want to `insert` or `update` . Create `queryBuilders()`, then call `realtion()`, accepts `two parameters`, 1 is the ` Entity` `target` you want to insert, 2 is the relational data table. Ưith this example, we insert one `subject` to two `teachers`, so the `Entity` target now is `Subject`. Calling the `of()` function takes as parameter `the data of the target entity` to be inserted. And finally, call method `add()` to insert data

## Authentication with JWT, Passport

### PART ONE

- First, we need some package to handle this logic : `@nestjs/jwt`, `passport`, `passport-jwt`, `passport-local`, `@nestjs/passport` and don't forget to install @types/... for them

- Setup to use :

```ts
// auth.module.ts
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
  controllers: [AuthController],
  providers: [LocalStragery, AuthServices]
})
```

- Import `JwtModule` , register at module, use `registerAsync()`, `secret` or `sighOptions`, every time you create a `token`, the above options will be `used by default`, because they are `globally registered`, of course, this is just `for learning`, when reality will be different.

```ts
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

@Injectable()
export class LocalStragery extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {
    super()
  }
  private readonly logger = new Logger(LocalStragery.name)

  private async getUser(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      select: { username: true, password: true, id: true }
    })
    if (!user) {
      this.logger.debug(`User ${username} not found!`)
      throw new UnauthorizedException(messageResponse.NOT_FOUND_USER)
    }
    return user
  }

  async validate(username: string, password: string) {
    const user = await this.getUser(username)
    if (password !== user.password) {
      this.logger.debug(`Password not correct`)
      throw new UnauthorizedException(messageResponse.NOT_FOUND_USER)
    }
    return user
  }
}
```

- Create a class `LocalStragery`, it acts as middleware, handling data transmission. There are `2 main tasks`: check the input data, based on that to `find the user` in the database, 2 is to `perform authentication` when the user has been found. If valid, returns `user`. This `user` will be `assigned` to the request for `processing` in the `AuthController`

```ts
// auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServices) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request) {
    return {
      token: this.authService.generateToken(request.user)
    }
  }
}
```

- In `AuthController`, we see a decorator is `AuthGuard('local')`. This decorator, `as per my understanding`, I think it will `trigger` methods in `LocalStragery`, with name as input argument, we can define name in `LocalStragery` class. like this :

```ts
export class LocalStragery extends PassportStrategy(Strategy, 'something') {}
```

If not named, it will default to `local`

```ts
 async login(@Request() request) {}
```

- The login function receives a parameter called `request`. If the user has been `authenticated successfully`, `request.user` can be used

```ts
@Injectable()
export class AuthServices {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User) {
    const payload = { sub: user.id }
    return this.jwtService.sign(payload)
  }
}
```

- In `AuthServices`, defined a method to create a `token` upon `successful authentication`, using data from `request.user`

### Complete login flow

```ts
// jwt.stragety.ts
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStragety extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET
    })
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: { username: true, email: true }
    })
    return user
  }
}
```

- After `successfully logging` in and `returning the token`, we create a `jwt.strategy.ts` file so that every time we `send a request to the server`, we will attach that `token to the header` for testing, to check if there is `permission` to `access` that `resource`

- Create a function to get `information` about the `user` who `just logged` in with the `newly created token`. Return `user` will be use by `request.user`

```ts
// auth.controller.ts
@Get('whoami')
  @UseGuards(AuthGuard('jwt'))
  async whoAmI(@Request() request) {
    return request.user
  }
```

- As in the `previous example`, `@AuthGuards` takes a `name`, we `can define` it in jwt.strategy.ts, otherwise the default is `jwt`. After `successful authentication`, we can get user `information` via `request.user`
