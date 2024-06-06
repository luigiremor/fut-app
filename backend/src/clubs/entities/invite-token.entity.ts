import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Club } from './club.entity';

@Entity()
export class InviteToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => Club)
  club: Club;

  @Column()
  expiresAt: Date;
}
