import { UserT, UserToResponseT } from './user.type';
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

  @Column('int', { width: 10 })
  rating: number;

  @Column('varchar', { length: 500 })
  description: string;

  constructor({
    name = 'USER',
    login = 'user',
    password = 'P@55w0rd',
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
}
