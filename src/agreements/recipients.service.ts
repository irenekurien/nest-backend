import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipient } from './recipients.entity';
import { User } from 'src/users/user.entity';
import { Agreement } from './agreements.entity';

@Injectable()
export class RecipientsService {
  constructor(
    @InjectRepository(Recipient) private repo: Repository<Recipient>,
  ) {}

 async create(user: User, agreement: Agreement, signLink: string, isSigned = false) {
    const recipient = this.repo.create({ user, agreement, isSigned, signLink });

    return this.repo.save(recipient);
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Recipient not found');
    }
    return this.repo.findOneBy({ id });
  }

  async findOneByAgreementId(agreementId: number): Promise<Recipient | undefined> {
    return this.repo.findOne({ where: { agreement: { id: agreementId } } });
  }

  async findOneByUserId(userId: number): Promise<Recipient | undefined> {
    return this.repo.findOne({ where: { user: { id: userId } } });
  }

  async updateByEmail(reqId: number, email: string): Promise<void> {
    const recipient = await this.repo.findOne({
      where: { agreement: { requestId: reqId }, user: { email } },
    });

    if (recipient) {
      recipient.isSigned = true;
      await this.repo.save(recipient);
    }
  }

  async update(id: number, attrs: Partial<Recipient>) {
    const recipient = await this.findOne(id);

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }
    Object.assign(recipient, attrs);

    return this.repo.save(recipient);
  }

  async remove(id: number) {
    const recipient = await this.findOne(id);

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    return this.repo.remove(recipient);
  }
}
