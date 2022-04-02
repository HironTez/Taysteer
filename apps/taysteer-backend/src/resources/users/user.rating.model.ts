import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { User } from './user.model';

@Entity('UserRating')
export class UserRating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  rater: User;

  @Column('int', { width: 5 })
  rating: number;

  @ManyToOne(() => User, (user) => user.raters, { onDelete: 'CASCADE' })
  user: User;
}
