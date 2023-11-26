import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Agreement } from './agreements.entity';

@Entity()
export class Recipient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Agreement, (agreement) => agreement.recipient1)
  @JoinColumn()
  agreement1: Agreement;

  @OneToOne(() => Agreement, (agreement) => agreement.recipient2)
  @JoinColumn()
  agreement2: Agreement;

  @Column({ default: false })
  isSigned: boolean;

  @Column({ nullable: true })
  signLink: string;
}
