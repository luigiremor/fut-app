import { Exclude } from 'class-transformer';
import { UserClub } from 'src/user-club/entities/user-club.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => UserClub, (userClub) => userClub.user)
  userClubs: UserClub[];
}
