import { UseInterceptors, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from 'class-transformer';

interface ClassConsturctor {
    new (...args: any[]): {};
}

export function Serialize(dto: ClassConsturctor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConsturctor)   {}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}