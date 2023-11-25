import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Recipient } from './recipients.entity';
import { Document } from '../documents/document.entity';

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Recipient, (recipient) => recipient.agreement)
  recipient: Recipient[];

  @OneToOne(() => Document, (document) => document.agreement, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  document: Document;

  @Column()
  requestId: number;

  @Column()
  docId: number;
}
