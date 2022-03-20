import { Recipe } from './recipe.model';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';

@Entity('RecipeRater')
export class RecipeRater extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  raterId: string;

  @Column('int', { width: 5 })
  rating: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.raters)
  recipe: Recipe;

  constructor({
    raterId = '',
    rating = 0
  } = {}) {
    super();
    this.raterId = raterId;
    this.rating = rating;
  }
}
