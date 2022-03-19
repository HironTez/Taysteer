import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { User } from './user.model';

@Entity('UserRater')
export class UserRater extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  raterId: string;

  @Column('int', { width: 5 })
  rating: number;

  @ManyToOne(() => User, (user) => user.raters)
  user: User;

  constructor({
    raterId = '',
    rating = 0
  } = {}) {
    super();
    this.raterId = raterId;
    this.rating = rating;
  }
}
