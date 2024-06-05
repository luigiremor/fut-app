import { Club } from 'src/clubs/entities/club.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  MEMBER = 'member',
}

@Entity()
export class UserClub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: string;

  @ManyToOne(() => User, (user) => user.userClubs)
  user: User;

  @ManyToOne(() => Club, (club) => club.userClubs)
  club: Club;
}
