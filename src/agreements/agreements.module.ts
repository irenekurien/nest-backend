import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { Agreement } from './agreements.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agreement]), UsersModule],
  controllers: [AgreementsController],
  providers: [AgreementsService]
})
export class AgreementsModule {}
