import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AgreementsModule } from './agreements/agreements.module';
import { AuthService } from './users/auth.service';

@Module({
  imports: [UsersModule, AgreementsModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
