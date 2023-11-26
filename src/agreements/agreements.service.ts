import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgreementDto } from './dtos/create-agreement.dto';
import { User } from 'src/users/user.entity';
import { Agreement } from './agreements.entity';
import { UsersService } from 'src/users/users.service';
import { DocumentsService } from 'src/agreements/documents.service';
import { ZohoSignService } from './zoho.service';
import { RecipientsService } from './recipients.service';
import { Recipient } from './recipients.entity';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectRepository(Agreement) private repo: Repository<Agreement>,
    @InjectRepository(Recipient) private recipientRepo: Repository<Recipient>,
    private usersService: UsersService,
    private recipientService: RecipientsService,
    private documentsService: DocumentsService,
    private zohoSignService: ZohoSignService,
  ) {}

  async create(agreementDto: CreateAgreementDto) {
    if (agreementDto.user1Email === agreementDto.user2Email) {
      throw new BadRequestException(
        'Agreement should be between 2 different people',
      );
    }
    const [user1] = await this.usersService.find(agreementDto.user1Email);
    const [user2] = await this.usersService.find(agreementDto.user2Email);

    if (!user1 || !user2) {
      throw new NotFoundException('User not found');
    }

    await this.documentsService.addRecipients({ user1, user2 });

    try {
      const response = await this.zohoSignService.createZohoSignRequest(
        'src/pdfs/new.pdf',
        user1,
        user2,
      );

      const { link1, link2 } = await this.zohoSignService.sendZohoSignRequest(
        response.requests.request_id,
        user1,
        user2,
      );

      const agreement = await this.repo.create({
        requestId: response.requests.request_id,
      });

      await this.repo.save(agreement);

      const recipient1 = await this.recipientService.create({
        user: user1,
        agreement1: agreement,
        signLink: link1,
      });
      const recipient2 = await this.recipientService.create({
        user: user2,
        agreement2: agreement,
        signLink: link2,
      });

      agreement.recipient1 = recipient1;
      agreement.recipient2 = recipient2;

      return await this.repo.save(agreement);
    } catch (e) {
      console.error(e);
    }
  }

  async findAll(user: User) {
    const id = user?.id;
    if (!id) {
      throw new NotFoundException('Agreement not found');
    }

    if (user.isAdmin) {
      return await this.repo.find({
        relations: [
          'recipient1',
          'recipient1.user',
          'recipient2',
          'recipient2.user',
        ],
      });
    }

    return await this.repo.find({
      where: [
        { recipient1: { user: { id } } },
        { recipient2: { user: { id } } },
      ],
      relations: [
        'recipient1',
        'recipient1.user',
        'recipient2',
        'recipient2.user',
      ],
    });
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Agreement not found');
    }

    const agreement = await this.repo.findOne({
      where: { id },
      relations: [
        'recipient1',
        'recipient1.user',
        'recipient2',
        'recipient2.user',
      ],
    });

    if (!agreement) {
      throw new NotFoundException('Agreement not found');
    }

    return agreement;
  }

  find(requestId: number) {
    return this.repo.findOne({ where: { requestId } });
  }

  async remove(id: number) {
    const agreement = await this.findOne(id);
    console.log(agreement);
    return this.repo.delete(agreement);
  }

  async handleWebhooks(payload: any) {
    console.log(payload);
    const requestStatus = payload.requests.request_status;
    const requestId = payload.requests.request_id;
    const userEmail = payload.notifications.performed_by_email;

    const agreement = await this.repo.find(requestId);
    if (agreement) {
      await this.recipientService.updateByEmail(requestId, userEmail);
    }

    if (requestStatus === 'completed' && userEmail === 'System Generated') {
      await this.getSignedCertificate(requestId);
    }
  }

  async getSignedCertificate(requestId) {
    await this.zohoSignService.getCompletionCertificate(requestId);
    await this.documentsService.uploadToFirebaseStorage(
      'src/pdfs/certificate.pdf',
      `${requestId}`,
    );
    const certLink = await this.documentsService.generateDownloadUrl(
      `${requestId}`,
    );

    const [agreement] = await this.repo.find(requestId);
    agreement.certificateLink = certLink;
    this.repo.save(agreement);
  }

  async getLink(requestId) {
    const [agreement] = await this.repo.find(requestId);
    return agreement.certificateLink;
  }
}
