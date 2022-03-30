import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.model';
import { Comment } from './recipe.comment.model';
import { RecipeRater } from './recipe.rater.model';
import {
  CommentT,
  RecipeIngredientT,
  RecipeRaterT,
  RecipeStepT,
  RecipeToResponseT,
  RecipeToResponseDetailedT,
} from './recipe.types';

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

  @Column('json')
  ingredients: RecipeIngredientT[];

  @Column('json')
  steps: RecipeStepT[];

  @Column('int', { width: 10 })
  rating: number;

  @Column('int')
  ratingsCount: number;

  @Column('int')
  ratingsSum: number;

  @OneToMany(() => RecipeRater, (rater) => rater.recipe)
  raters: RecipeRaterT[];

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: CommentT[];

  constructor({
    title = '',
    image = '',
    description = '',
    ingredients = [],
    steps = [],
    user = new User(),
    update=false
  } = {}) {
    super();
    this.title = title;
    this.description = description;
    this.image = image;
    this.ingredients = ingredients;
    this.steps = steps;
    this.user = user;
    if (!update) {
      this.rating = 0;
      this.ratingsCount = 0;
      this.ratingsSum = 0;
    }
  }

  static toResponse(recipe: Recipe): RecipeToResponseT {
    const { id, title, image, description, rating } = recipe;
    return { id, title, image, description, rating };
  }

  static toResponseDetailed(recipe: Recipe): RecipeToResponseDetailedT {
    const {
      id,
      title,
      image,
      description,
      rating,
      ratingsCount,
      user,
      ingredients,
      comments,
    } = recipe;
    return {
      id,
      title,
      image,
      description,
      rating,
      ratingsCount,
      user,
      ingredients,
      comments,
    };
  }
}
