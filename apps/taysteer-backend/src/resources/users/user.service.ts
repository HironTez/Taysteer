import {
  GetAllT,
  GetByIdT,
  GetByLoginT,
  AddUserT,
  UpdateUserT,
  DeleteUserT,
  GetUsersByRatingT,
  RateUserT,
  CheckAccessT,
} from './user.service.types';
import { UserT } from './user.type';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<UserT>
  ) {}

  checkAccess: CheckAccessT = async (user, requestedId, shouldBeOwner = true) => {
    const isOwner = user.id == requestedId;
    const isAdmin = user.id == (await this.getByLogin('admin')).id;
    return (isOwner && shouldBeOwner) || isAdmin;
  }

  getAllUsers: GetAllT = () => this.usersRepository.find();

  getById: GetByIdT = (id) => this.usersRepository.findOne(id);

  getByLogin: GetByLoginT = (login) =>
    this.usersRepository.findOne({ login: login });

  addUser: AddUserT = async (user) => {
    const login = user.login;
    if (!login || await this.usersRepository.findOne({ login })) return false; // Exit if user already exist
    return this.usersRepository.save({
      // Save user with password hash
      ...user,
      ...{ password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)) },
    });
  };

  updateUser: UpdateUserT = async (id, newUser) => {
    const login = newUser.login;
    if (!login || await this.usersRepository.findOne({ login })) return false; // Exit if user with same login already exist

    const user = await this.getById(id);

    return this.usersRepository.save({
      ...user,
      ...{
        ...newUser,
        ...{
          password: await bcrypt.hash(newUser.password, bcrypt.genSaltSync(10)),
        },
      },
    });
  };

  deleteUser: DeleteUserT = (id) => this.usersRepository.delete(id);

  getUsersByRating: GetUsersByRatingT = async (num = 10) => {
    const users = await this.usersRepository.find({
      order: { rating: 'DESC' },
      take: num,
    });
    return users;
  };

  rateUser: RateUserT = async (id, rating) => {
    if (!rating) return false;
    else if (rating > 5) rating = 5;
    const user = await this.getById(id);
    if (!user) return false;

    const new_ratings_number = user.ratings_number + 1;
    const new_ratings_sum = user.ratings_sum + rating;
    const new_rating = new_ratings_sum / new_ratings_number;

    return this.usersRepository.save({
      ...user,
      ...{
        ratings_number: new_ratings_number,
        ratings_sum: new_ratings_sum,
        rating: new_rating,
      },
    });
  };
}
