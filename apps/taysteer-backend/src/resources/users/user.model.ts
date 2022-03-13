import { UserT, UserMinT, UserToResponseT, UserToResponseDetailedT } from './user.type';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 50 })
  login: string;

  @Column('text')
  password: string;

  @Column('varchar', { length: 150 })
  image: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('int', { width: 10 })
  rating: number;

  @Column('int')
  ratings_number: number;

  @Column('int')
  ratings_sum: number;

  constructor({
    name = 'USER',
    login = '',
    password = '',
    image = '',
    description = '',
  } = {}) {
    super();
    this.name = name;
    this.login = login;
    this.password = password;
    this.image = image;
    this.description = description;
  }

  static toResponse(user: UserT): UserToResponseT {
    const { id, name, login, image, rating } = user;
    return { id, name, login, image, rating } as User;
  }

  static toResponseDetailed(user: UserT): UserToResponseDetailedT {
    const { id, name, login, image, rating, ratings_number, description } = user;
    return { id, name, login, image, rating, ratings_number, description } as User;
  }

  static toResponseMin(user: UserT): UserMinT {
    const { id, login } = user;
    return { id, login } as User;
  }
}
