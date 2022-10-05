import { RecipeStringTypes } from './recipe.service.types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
  getRepository,
} from 'typeorm';
import { User } from '../users/user.model';
import { Comment } from './recipe.comment.model';
import { RecipeRating } from './recipe.rating.model';
import {
  RecipeIngredientT,
  RecipeStepT,
  RecipeToResponseT,
  RecipeToResponseDetailedT,
} from './recipe.types';
import { loadObject } from '../../utils/promise.loader';

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
  ingredients: Array<RecipeIngredientT>;

  @Column('json')
  steps: { [key: string]: RecipeStepT };

  @Column('int', { width: 10 })
  rating: number = 0;

  @Column('int')
  ratingsCount: number = 0;

  @Column('int')
  ratingsSum: number = 0;

  @OneToMany(() => RecipeRating, (rater) => rater.recipe)
  raters?: Array<RecipeRating>;

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments?: Array<Comment>;

  constructor({
    title = '',
    image = '',
    description = '',
    ingredients = new Array(),
    steps = {},
    user = new User(),
    update = false,
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

  static async toResponseDetailed(
    recipe: Recipe
  ): Promise<RecipeToResponseDetailedT> {
    const {
      id,
      title,
      image,
      description,
      rating,
      ratingsCount,
      user,
      ingredients,
      steps,
    } = recipe;
    return loadObject({
      id,
      title,
      image,
      description,
      rating,
      ratingsCount,
      user: User.toResponse(user),
      ingredients,
      steps,
      countOfComments: await getRepository(Comment).count({
        relations: [RecipeStringTypes.RECIPE],
        where: { recipe: recipe },
      }),
    });
  }
}
