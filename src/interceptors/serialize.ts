import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors
} from '@nestjs/common'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { Observable, map } from 'rxjs'

export class SerializerInterCeptor implements NestInterceptor {
  constructor(private dtoIntances: ClassConstructor<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dtoIntances, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}

export function Serializer(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializerInterCeptor(dto))
}
