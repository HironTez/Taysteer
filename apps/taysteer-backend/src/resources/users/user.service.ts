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
  ValidateUserDataT,
  ChangeUserImageT,
} from './user.service.types';
import { UserT } from './user.type';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { cloudinary } from 'configs/utils/cloudinary';
import streamifier from 'streamifier';
import { PromiseController } from '../../utils/promise.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<UserT>
  ) {}

  checkAccess: CheckAccessT = async (
    user,
    requestedId,
    shouldBeOwner = true
  ) => {
    const isOwner = user.id == requestedId;
    const isAdmin = user.id == (await this.getByLogin('admin')).id;
    return (isOwner && shouldBeOwner) || isAdmin;
  };

  validateUserData: ValidateUserDataT = async (user) => {
    if (
      !user.login ||
      !user.password ||
      (await this.usersRepository.findOne({ login: user.login })) || // Check if the same user already exists
      user.name.length > 50 ||
      user.login.length > 50 ||
      user.password.length > 50 ||
      user.image.length > 150 ||
      user.description.length > 500
    )
      return false;
    else return true;
  };

  getAllUsers: GetAllT = () => this.usersRepository.find();

  getById: GetByIdT = (id) => this.usersRepository.findOne(id);

  getByLogin: GetByLoginT = (login) =>
    this.usersRepository.findOne({ login: login });

  addUser: AddUserT = async (user) => {
    if (!(await this.validateUserData(user))) return false; // Validate data
    // Save user with password hash
    return this.usersRepository.save({
      ...user,
      ...{ password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)) },
    });
  };

  updateUser: UpdateUserT = async (id, newUser) => {
    if (!(await this.validateUserData(newUser))) return false; // Validate data

    const user = await this.getById(id);
    // Update the user
    return this.usersRepository.save({
      ...user,
      ...{
        ...newUser,
        ...{
          password: newUser.password
            ? await bcrypt.hash(newUser.password, bcrypt.genSaltSync(10))
            : user.password,
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

  changeUserImage: ChangeUserImageT = async (id, fileReadStream) => {
    const user = await this.getById(id);
    if (user.image) await cloudinary.uploader.destroy(user.id); // Delete old image
    const promiseController = new PromiseController(); // Create new promise controller
    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: user.id, upload_preset: 'user_avatar' },
      (error, result) => {
        if (!error) {
          promiseController.resolve(result); // Return response using promise
        } else promiseController.resolve(false);
      }
    );
    fileReadStream.pipe(uploadStream); // Connect file read stream
    const uploadedResponse = await promiseController.promise; // Get response
    return uploadedResponse
      ? this.usersRepository.save({
          ...user,
          ...{
            image: uploadedResponse.url, // New url
          },
        })
      : false;
  };
}
