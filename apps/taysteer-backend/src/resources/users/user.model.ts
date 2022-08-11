import { UserStringTypes } from './user.service.types';
import { Recipe } from './../recipes/recipe.model';
import {
  UserMinT,
  UserToResponseT,
  UserToResponseDetailedT,
} from './user.types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  getRepository,
} from 'typeorm';

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 50 })
  login: string;

  @Column('varchar', { length: 60 })
  password: string;

  @Column('varchar', { length: 150 })
  image: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('int', { width: 10 })
  rating: number;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  constructor({
    name = '',
    login = '',
    password = '',
    description = '',
    image = '',
  } = {}) {
    super();
    this.name = name;
    this.login = login;
    this.password = password;
    this.description = description;
    this.image = image;
    this.rating = 0;
  }

  private async calculateRating(): Promise<number> {
    return (
      await getRepository(Recipe).find({
        relations: [UserStringTypes.USER],
        where: { user: this },
      })
    ).reduce((acc, recipe, index) => {
      return (acc * index + recipe.rating) / (index + 1);
    }, 0);
  }

  static async toResponse(user: User): Promise<UserToResponseT> {
    const rating = await user.calculateRating();
    const { id, name, login, image } = user;
    return { id, name, login, image, rating } as User;
  }

  static async toResponseDetailed(
    user: User
  ): Promise<UserToResponseDetailedT> {
    const rating = await user.calculateRating();
    const countOfRecipes = await getRepository(Recipe).count({
      relations: [UserStringTypes.USER],
      where: { user: user },
    });
    const { id, name, login, image, description } = user;
    return {
      id,
      name,
      login,
      image,
      rating,
      description,
      countOfRecipes,
    };
  }

  static toResponseMin(user: User): UserMinT {
    const { id, login } = user;
    return { id, login } as User;
  }
}
