import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { RecipientsService } from './recipients.service';
import { ZohoSignService } from './zoho.service';
import { Agreement } from './agreements.entity';
import { Recipient } from './recipients.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agreement, Recipient]),
    UsersModule,
    DocumentsModule,
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService, RecipientsService, ZohoSignService],
})
export class AgreementsModule {}
