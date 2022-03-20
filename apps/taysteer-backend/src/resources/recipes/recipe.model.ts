import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../users/user.model';
import { Comment } from './recipe.comment.model';
import { RecipeRater } from './recipe.rater.model';
import { CommentT, RecipeIngredientT, RecipeRaterT, RecipeStepT, RecipeT, RecipeToResponseT } from './recipe.types';

@Entity('Recipe')
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  title: string;

  @Column('varchar', { length: 150 })
  image: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('jsonb', { array: true })
  ingredients: RecipeIngredientT[];

  @Column('jsonb', { array: true })
  steps: RecipeStepT[];

  @Column('int', { width: 10 })
  rating: number;

  @Column('int')
  ratings_count: number;

  @Column('int')
  ratings_sum: number;

  @OneToMany(() => RecipeRater, (rater) => rater.recipe)
  raters: RecipeRaterT[];

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: CommentT[];

  constructor({
    title = '',
    description = '',
    ingredients = [],
    steps = [],
  } = {}) {
    super();
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.steps = steps;
    this.image = '';
    this.rating = 0;
    this.ratings_count = 0;
    this.ratings_sum = 0;
  }

  toResponse(recipe: RecipeT): RecipeToResponseT {
    const { id, title, image, description, rating } = recipe;
    return { id, title, image, description, rating };
  }
}
