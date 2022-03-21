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
  UserStringTypes,
} from './user.service.types';
import { UserT } from './user.types';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { ADMIN_LOGIN, ADMIN_PASSWORD } from 'configs/common/config';
import { UserRater } from './user.rater.model';
import { deleteImage, uploadImage } from '../../utils/image.uploader';
import { UserDataDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<UserT>,
    @InjectRepository(UserRater)
    private userRatersRepository: Repository<UserRater>
  ) {
    const admin = new User({ login: ADMIN_LOGIN, password: ADMIN_PASSWORD });
    this.addUser(admin);
  }

  checkAccess: CheckAccessT = async (
    user,
    requestedId,
    shouldBeOwner = true
  ) => {
    const isOwner = user.id == requestedId;
    const isAdmin = user.id == (await this.getByLogin(ADMIN_LOGIN)).id;
    return isOwner == shouldBeOwner || isAdmin;
  };

  validateUserData: ValidateUserDataT = async (userData, updating = false) => {
    if (!updating) {
      // If it's a data for creating a new user
      if (!userData.login || !userData.password) return false; // Check if the login and password exists
    } else {
      // If it's a data for updating a user
      if (
        // Check if rating don't exist in the data
        'rating' in userData ||
        'ratings_count' in userData ||
        'ratings_sum' in userData
      )
        return false;
    }
    if (
      // Check if the data is valid
      (await this.getByLogin(userData.login)) || // Check if the same user don't exists
      userData.name.length > 50 ||
      userData.login.length > 50 ||
      userData.password.length > 50 ||
      userData.description.length > 500
    )
      return false;
    return true;
  };

  getAllUsers: GetAllT = () => this.usersRepository.find();

  getById: GetByIdT = (id) => this.usersRepository.findOne(id);

  getByLogin: GetByLoginT = (login) =>
    this.usersRepository.findOne({ login: login });

  addUser: AddUserT = async (userData, images) => {
    if (!(await this.validateUserData(userData, false))) return false; // Validate data

    const user = new User(userData); // Create user

    // Upload image
    if (images) {
      // Get image
      let image: NodeJS.ReadableStream;
      for await (const img of images) {
        image = img;
        break;
      }
      // Upload image
      const uploadedResponse = await uploadImage(
        user.id,
        image,
        UserStringTypes.IMAGES_FOLDER
      );
      if (uploadedResponse) user.image = uploadedResponse;
    }
    // Save user with password hash
    return this.usersRepository.save({
      ...user,
      ...{ password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)) },
    });
  };

  updateUser: UpdateUserT = async (id, userData, images) => {
    if (!(await this.validateUserData(userData, true))) return false; // Validate data

    const user = await this.getById(id);
    if (!user) return false; // Exit if user does not exist

    // Upload image
    if (images) {
      // Get image
      let image: NodeJS.ReadableStream;
      for await (const img of images) {
        image = img;
        break;
      }
      // Upload image
      const uploadedResponse = await uploadImage(
        user.id,
        image,
        UserStringTypes.IMAGES_FOLDER
      );
      if (uploadedResponse) user.image = uploadedResponse;
    }

    // Update the user
    return this.usersRepository.save({
      ...user,
      ...{
        ...userData,
        ...{
          password: userData.password // Set a hash of the password
            ? await bcrypt.hash(userData.password, bcrypt.genSaltSync(10))
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
    if (!user) return false;
    if (user.raters) {
      // Delete the all raters
      for (const rater of user.raters) {
        this.userRatersRepository.delete(rater);
      }
    }
    deleteImage(id, UserStringTypes.IMAGES_FOLDER); // Delete the image
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
}
