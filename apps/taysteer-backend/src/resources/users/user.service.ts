import {
  GetAllT,
  GetByIdT,
  GetByLoginT,
  AddUserT,
  UpdateUserT,
  DeleteUserT,
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

  getAllUsers: GetAllT = () => this.usersRepository.find();

  getById: GetByIdT = (id: string) => this.usersRepository.findOne(id);

  getByLogin: GetByLoginT = (login: string) =>
    this.usersRepository.findOne({ login: login });

  addUser: AddUserT = async (user: UserT) => {
    const login = user.login;
    if (await this.usersRepository.findOne({ login })) return false; // Exit if user already exist
    return this.usersRepository.save({
      // Save user with password hash
      ...user,
      ...{ password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)) },
    });
  };

  updateUser: UpdateUserT = async (id: string, newUser: UserT) => {
    const login = newUser.login;
    if (await this.usersRepository.findOne({ login })) return false; // Exit if user with same login already exist

    return this.usersRepository.save({
      ...(await this.getById(id)),
      ...{
        ...newUser,
        ...{
          password: await bcrypt.hash(newUser.password, bcrypt.genSaltSync(10)),
        },
      },
    });
  };

  deleteUser: DeleteUserT = (id: string) => this.usersRepository.delete(id);
}
