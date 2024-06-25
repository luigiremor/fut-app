import { Exclude } from 'class-transformer';
import { Match } from 'src/matches/entities/match.entity';
import { PlayerRating } from 'src/player-ratings/entities/player-rating.entity';
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

  @OneToMany(() => PlayerRating, (rating) => rating.reviewer)
  givenRatings: PlayerRating[];

  @OneToMany(() => PlayerRating, (rating) => rating.reviewee)
  receivedRatings: PlayerRating[];

  @OneToMany(() => Match, (match) => match.confirmedUsers)
  matches: Match[];
}
