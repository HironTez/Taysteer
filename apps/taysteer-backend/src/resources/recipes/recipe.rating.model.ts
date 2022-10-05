import { User } from './../users/user.model';
import { Recipe } from './recipe.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

@Entity('RecipeRating')
export class RecipeRating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  rater: User | undefined;

  @Column('int', { width: 5 })
  rating: number = 0;

  @ManyToOne(() => Recipe, (recipe) => recipe.raters, { onDelete: 'CASCADE' })
  recipe: Recipe | undefined;
}
