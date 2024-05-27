import { UserClub } from 'src/user-club/entities/user-club.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => UserClub, (userClub) => userClub.club)
  userClubs: UserClub[];
}
