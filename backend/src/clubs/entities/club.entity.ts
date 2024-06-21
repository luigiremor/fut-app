import { Match } from 'src/matches/entities/match.entity';
import { UserClub } from 'src/user-club/entities/user-club.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Match, (match) => match.club)
  matches: Match[];

  @OneToMany(() => UserClub, (userClub) => userClub.club)
  userClubs: UserClub[];
}
