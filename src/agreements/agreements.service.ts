import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgreementDto } from './dtos/create-agreement.dto';
import { User } from 'src/users/user.entity';
import { Agreement } from './agreements.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AgreementsService {
    constructor(
        @InjectRepository(Agreement) private repo: Repository<Agreement>,
        private usersService: UsersService
    ) {}

    async create(agreementDto: CreateAgreementDto) {
        if(agreementDto.user1Email === agreementDto.user2Email) {
            throw new BadRequestException('Agreement should be between 2 different people');
        }
        const [user1] = await this.usersService.find(agreementDto.user1Email);
        const [user2] = await this.usersService.find(agreementDto.user2Email);

        if(!user1 || !user2)    {
            throw new NotFoundException('User not found');
        }

        const agreement = this.repo.create({});
        agreement.user1 = user1;
        agreement.user2 = user2;
        return this.repo.save(agreement);
    }

    async findAll(user: User) {
        const id = user?.id; 
        if (!id) {
            throw new NotFoundException('Agreement not found');
        }

        if(user.isAdmin)    {
            return await this.repo.find({ relations: ['user1', 'user2'] });
        }

        const agreements = await this.repo.find({
            where: { id },
            relations: ['user1', 'user2'],
        });
              
        return agreements;
    }

    async findOne(id: number) {
        if (!id) {
          throw new NotFoundException('Agreement not found');
        }
      
        const agreement = await this.repo.findOne({
            where: { id },
            relations: ['user1', 'user2'],
        });
              
        if (!agreement) {
          throw new NotFoundException('Agreement not found');
        }
      
        return agreement;
      }
      
}
