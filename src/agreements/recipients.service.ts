import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipient } from './recipients.entity';
import { CreateRecipientDto } from './dtos/create-recipient.dto';

@Injectable()
export class RecipientsService {
  constructor(
    @InjectRepository(Recipient) private repo: Repository<Recipient>,
  ) {}

 async create(createRecipient: CreateRecipientDto) {
    const recipient = this.repo.create(createRecipient);
    return this.repo.save(recipient);
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Recipient not found');
    }
    return this.repo.findOneBy({ id });
  }

  async findOneByUserId(userId: number): Promise<Recipient | undefined> {
    return this.repo.findOne({ where: { user: { id: userId } } });
  }

  async findByEmail(reqId: number, email: string): Promise<Recipient | undefined> {
    return await this.repo.findOne({
      where: [
        { agreement1: { requestId: reqId }, user: { email } },
        { agreement2: { requestId: reqId }, user: { email } },
      ],
    });
  }

  async updateByEmail(reqId: number, email: string): Promise<void> {
    const recipient = await this.findByEmail(reqId, email);

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
