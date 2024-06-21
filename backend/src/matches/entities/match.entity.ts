import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { User } from '../../user/user.entity';
import { PlayerRating } from 'src/player-ratings/entities/player-rating.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Club, (club) => club.matches)
  club: Club;

  @ManyToMany(() => User)
  @JoinTable()
  confirmedUsers: User[];

  @Column('simple-array')
  goals: string[]; // Array of user IDs

  @Column('simple-array')
  assists: string[]; // Array of user IDs

  @Column()
  date: string;

  @Column()
  location: string;

  @OneToMany(() => PlayerRating, (rating) => rating.match)
  ratings: PlayerRating[];
}
