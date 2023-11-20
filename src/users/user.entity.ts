import { Agreement } from '../agreements/agreements.entity';
import { Entity, Column,PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false})
    isAdmin: boolean;

    @OneToMany(() => Agreement, agreement => agreement.user1)
    agreementsUser1: Agreement[];
  
    @OneToMany(() => Agreement, agreement => agreement.user2)
    agreementsUser2: Agreement[];
}