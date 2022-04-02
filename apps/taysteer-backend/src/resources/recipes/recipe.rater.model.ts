import { User } from './../users/user.model';
import { Recipe } from './recipe.model';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';

@Entity('RecipeRater')
export class RecipeRater extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  rater: User;

  @Column('int', { width: 5 })
  rating: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.raters, { onDelete: 'CASCADE' })
  recipe: Recipe;

  constructor({
    rating = 0
  } = {}) {
    super();
    this.rating = rating;
  }
}
