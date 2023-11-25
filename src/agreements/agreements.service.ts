import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateAgreementDto } from './dtos/create-agreement.dto';
import { User } from 'src/users/user.entity';
import { Agreement } from './agreements.entity';
import { UsersService } from 'src/users/users.service';
import { DocumentsService } from 'src/documents/documents.service';
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
        '/Users/irene/Documents/Code/nest/backend/test.pdf',
        user1,
        user2,
      );

      const { link1, link2 } = await this.zohoSignService.sendZohoSignRequest(
        response.requests.request_id,
      );

      const agreement = await this.repo.create({
        docId: 0,
        requestId: response.requests.request_id,
        document: null,
      });

      await this.repo.save(agreement);

      await this.recipientService.create(user1, agreement, link1);
      await this.recipientService.create(user2, agreement, link2);

      return agreement;
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
        relations: ['recipient', 'recipient.user'],
      });
    }

    const agreements = await this.repo.find({
      where: { recipient: { user: { id } } },
      relations: ['recipient', 'recipient.user'],
    });

    const formattedAgreements = await Promise.all(
      agreements.map(async (agreement) => {
        const otherRecipient = await this.recipientRepo.find({
          where: { agreement: { id: agreement.id }, user: Not(id) },
          relations: ['user'],
          select: ['id', 'isSigned'],
        });

        const formattedRecipients = [...agreement.recipient, ...otherRecipient];

        return {
          id: agreement.id,
          recipient: formattedRecipients,
        };
      }),
    );

    console.log(formattedAgreements);

    return formattedAgreements;
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Agreement not found');
    }

    const agreement = await this.repo.findOne({
      where: { id },
      relations: ['recipient', 'recipient.user'],
    });

    if (!agreement) {
      throw new NotFoundException('Agreement not found');
    }

    return agreement;
  }

  find(requestId: number) {
    return this.repo.findOne({ where: { requestId } });
  }

  async handleWebhooks(payload: any) {
    const requestId = payload.requests.request_id;
    const userEmail = payload.notifications.performed_by_email;
    const agreement = await this.repo.find(requestId);
    if (agreement) {
      await this.recipientService.updateByEmail(requestId, userEmail);
    }
  }
}
