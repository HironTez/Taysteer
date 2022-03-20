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
  DeleteUserImageT,
  UserStringTypes,
} from './user.service.types';
import { UserT } from './user.types';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { cloudinary } from 'configs/utils/cloudinary';
import { PromiseController } from '../../utils/promise.controller';
import { ADMIN_LOGIN } from 'configs/common/config';
import { UserRater } from './user.rater.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<UserT>,
    @InjectRepository(UserRater)
    private userRatersRepository: Repository<UserRater>
  ) {}

  checkAccess: CheckAccessT = async (
    user,
    requestedId,
    shouldBeOwner = true
  ) => {
    const isOwner = user.id == requestedId;
    const isAdmin = user.id == (await this.getByLogin(ADMIN_LOGIN)).id;
    return isOwner == shouldBeOwner || isAdmin;
  };

  validateUserData: ValidateUserDataT = async (user) => {
    if (
      !user.login ||
      !user.password ||
      (await this.usersRepository.findOne({ login: user.login })) || // Check if the same user already exists
      user.image ||
      user.rating ||
      user.ratings_count ||
      user.ratings_sum ||
      user.name.length > 50 ||
      user.login.length > 50 ||
      user.password.length > 50 ||
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
    if (!user) return false; // Exit if user does not exist
    // Update the user
    return this.usersRepository.save({
      ...user,
      ...{
        ...newUser,
        ...{
          password: newUser.password // Set a hash of the password
            ? await bcrypt.hash(newUser.password, bcrypt.genSaltSync(10))
            : user.password,
        },
      },
    });
  };

  deleteUser: DeleteUserT = async (id) => {
    // Get the user
    const user = await this.usersRepository.findOne(id, {
      relations: ['raters'],
    });
    for (const rater of user.raters) this.userRatersRepository.delete(rater); // Delete the all raters
    this.deleteUserImage(id); // Delete the image
    const deleteResult = await this.usersRepository.delete(id); // Delete the user
    return deleteResult.affected; // Return a result
  };

  getUsersByRating: GetUsersByRatingT = async (num = 10) => {
    // Find users by rating in descending order
    const users = await this.usersRepository.find({
      order: { rating: 'DESC' },
      take: num,
    });
    return users;
  };

  rateUser: RateUserT = async (id, raterId, rating) => {
    // Validate data
    if (!rating) return false;
    else if (rating > 5) rating = 5;
    
    // Get the user with relations
    const user = await this.usersRepository.findOne(id, {
      relations: ['raters'],
    });
    if (!user) return false;

    // Try to find the rater
    const findingResult = await this.userRatersRepository.findOne({
      raterId: raterId,
    });
    // Create a new rater if not found
    const rater = findingResult
      ? findingResult
      : new UserRater({ raterId: raterId, rating: rating });

    let new_ratings_count: number = 0,
      new_ratings_sum: number = 0;

    // If it's a first rating
    if (!findingResult) {
      new_ratings_count = user.ratings_count + 1;
      new_ratings_sum = user.ratings_sum + rating;

      // Save the rater
      await this.userRatersRepository.save(rater);
      if (user.raters) user.raters.push(rater);
      else user.raters = [rater];
    }
    // If it's an updating of the rating
    else {
      new_ratings_count = user.ratings_count;
      new_ratings_sum = user.ratings_sum - rater.rating + rating;

      rater.rating = rating;
      await this.userRatersRepository.save(rater);
    }

    // Calculate the rating
    const new_rating = Math.round(new_ratings_sum / new_ratings_count);

    // Update the user
    return this.usersRepository.save({
      ...user,
      ...{
        ratings_count: new_ratings_count,
        ratings_sum: new_ratings_sum,
        rating: new_rating,
        raters: user.raters,
      },
    });
  };

  changeUserImage: ChangeUserImageT = async (id, fileReadStream) => {
    const user = await this.getById(id); // Get a user
    if (!user) return false; // Exit if user does not exist
    if (user.image) await this.deleteUserImage(id); // Delete a old image
    const promiseController = new PromiseController(); // Create a new promise controller
    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: user.id, folder: UserStringTypes.IMAGES_FOLDER },
      (error, result) => {
        if (!error) {
          promiseController.resolve(result); // Return a response using the promise
        } else promiseController.resolve(false);
      }
    );
    fileReadStream.pipe(uploadStream); // Connect the file read stream
    const uploadedResponse = await promiseController.promise; // Get a response
    // Update the user
    return uploadedResponse
      ? this.usersRepository.save({
          ...user,
          ...{
            image: uploadedResponse.url, // A new url
          },
        })
      : false;
  };

  deleteUserImage: DeleteUserImageT = async (id) => {
    const user = await this.getById(id); // Get user
    if (!user) return false; // Exit if user does not exist
    const response = await cloudinary.uploader.destroy(
      `${UserStringTypes.IMAGES_FOLDER}/${user.id}`
    ); // Delete a old image

    return response.result == 'ok'
      ? this.usersRepository.save({
          ...user,
          ...{
            image: '', // Delete a url
          },
        })
      : false;
  };
}
