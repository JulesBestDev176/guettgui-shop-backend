import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransformedResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T>> {
    return next.handle().pipe(
      map((responseData) => {
        // Si la reponse contient deja data/meta, on la passe telle quelle
        if (
          responseData &&
          typeof responseData === 'object' &&
          'data' in responseData
        ) {
          return responseData as TransformedResponse<T>;
        }

        return { data: responseData };
      }),
    );
  }
}
