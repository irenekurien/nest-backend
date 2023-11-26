import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { RecipientsService } from './recipients.service';
import { ZohoSignService } from './zoho.service';
import { Agreement } from './agreements.entity';
import { Recipient } from './recipients.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentsService } from './documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agreement, Recipient]),
    UsersModule,
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService, DocumentsService,RecipientsService, ZohoSignService],
})
export class AgreementsModule {}
