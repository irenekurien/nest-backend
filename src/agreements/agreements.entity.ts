import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Recipient } from './recipients.entity';

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Recipient, recipient => recipient.agreement1, { nullable: true })
  @JoinColumn()
  recipient1: Recipient;

  @OneToOne(() => Recipient, recipient => recipient.agreement2, { nullable: true })
  @JoinColumn()
  recipient2: Recipient;

  @Column()
  requestId: number;

  @Column({ nullable: true })
  certificateLink: string;
}
