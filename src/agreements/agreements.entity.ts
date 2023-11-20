import { User } from '../users/user.entity';
import { Entity, Column,PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Agreement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.agreementsUser1)
    user1: User;
  
    @ManyToOne(() => User, user => user.agreementsUser2)
    user2: User;
  
    @Column({ default: false })
    signedByUser1: boolean;
  
    @Column({ default: false })
    signedByUser2: boolean;
}