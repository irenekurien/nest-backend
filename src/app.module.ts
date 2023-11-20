import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AgreementsModule } from './agreements/agreements.module';
import { User } from './users/user.entity';
import { Agreement } from './agreements/agreements.entity';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database: 'db.sqlite',
      entities: [User, Agreement],
      synchronize: true
    }), UsersModule, 
    AgreementsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasfd'],
        }),
      )
      .forRoutes('*');
  }
}