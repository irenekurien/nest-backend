import {
    Column,
    Entity,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToOne,
} from 'typeorm';
import { Agreement } from '../agreements/agreements.entity';

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    link: string;
  
    @OneToOne(() => Agreement, agreement => agreement.document)
    @JoinColumn()
    agreement: Agreement;
}
