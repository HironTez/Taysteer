import { Recipe } from './../recipes/recipe.model';
import {
  UserMinT,
  UserToResponseT,
  UserToResponseDetailedT,
  UserRaterT,
} from './user.types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { UserRater } from './user.rater.model';

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

  @Column('int')
  ratingsCount: number;

  @Column('int')
  ratingsSum: number;

  @OneToMany(() => UserRater, (rater) => rater.user)
  raters: UserRaterT[];

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  constructor({
    name = 'User',
    login = '',
    password = '',
    description = '',
  } = {}) {
    super();
    this.name = name;
    this.login = login;
    this.password = password;
    this.description = description;
    this.image = '';
    this.rating = 0;
    this.ratingsCount = 0;
    this.ratingsSum = 0;
  }

  static toResponse(user: User): UserToResponseT {
    const { id, name, login, image, rating } = user;
    return { id, name, login, image, rating } as User;
  }

  static toResponseDetailed(user: User): UserToResponseDetailedT {
    const {
      id,
      name,
      login,
      image,
      rating,
      ratingsCount,
      description,
      recipes,
    } = user;
    return {
      id,
      name,
      login,
      image,
      rating,
      ratingsCount,
      description,
      recipes,
    } as User;
  }

  static toResponseMin(user: User): UserMinT {
    const { id, login } = user;
    return { id, login } as User;
  }
}
