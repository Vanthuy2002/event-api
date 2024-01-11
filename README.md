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
