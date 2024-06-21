import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { User } from '../../user/user.entity';

@Entity()
export class PlayerRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Match, (match) => match.ratings)
  match: Match;

  @ManyToOne(() => User, (user) => user.givenRatings)
  reviewer: User;

  @ManyToOne(() => User, (user) => user.receivedRatings)
  reviewee: User;

  @Column()
  rating: number;
}
