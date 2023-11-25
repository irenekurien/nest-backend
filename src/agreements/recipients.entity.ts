import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Agreement } from './agreements.entity';

@Entity()
export class Recipient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Agreement, agreement => agreement.recipient)
  @JoinColumn({ name: 'agreementId' })
  agreement: Agreement;

  @Column()
  isSigned: boolean;

  @Column()
  signLink: string;
}
