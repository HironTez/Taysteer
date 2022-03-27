import { FormDataDto } from './../../typification/dto';
import {
  CreateAdminT,
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
import { UserRaterT, UserT } from './user.types';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { ADMIN_LOGIN, ADMIN_PASSWORD } from 'configs/common/config';
import { UserRater } from './user.rater.model';
import { deleteImage, uploadImage } from '../../utils/image.uploader';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<UserT>,
    @InjectRepository(UserRater)
    private userRatersRepository: Repository<UserRaterT>
  ) {
    this.createAdmin();
  }

  createAdmin: CreateAdminT = async () => {
    const adminExists = await this.userRepository.findOne({
      login: ADMIN_LOGIN,
    });
    if (!adminExists) {
      const admin = new User({ login: ADMIN_LOGIN, password: ADMIN_PASSWORD });
      this.userRepository.save({
        ...admin,
        ...{
          password: await bcrypt.hash(ADMIN_PASSWORD, bcrypt.genSaltSync(10)),
        },
      });
    }
  };

  checkAccess: CheckAccessT = async (
    user,
    requestedId,
    shouldBeOwner = true
  ) => {
    const isOwner = user.id == requestedId;
    const isAdmin = user.id == (await this.getUserByLogin(ADMIN_LOGIN)).id;
    return isOwner == shouldBeOwner || isAdmin;
  };

  validateUserData: ValidateUserDataT = async (userData, updating = false) => {
    if (!updating) {
      // If it's a data for creating a new user
      if (!userData.password) return false; // Check if the login and password exists
    }
    if (
      // Check if the data is valid
      userData.name?.length > 50 ||
      userData.login?.length > 50 ||
      userData.password?.length > 50 ||
      userData.description?.length > 500
    )
      return false;
    return true;
  };

  getAllUsers: GetAllT = () => this.userRepository.find();

  getUserById: GetByIdT = (id) => this.userRepository.findOne(id);

  getUserByLogin: GetByLoginT = (login) =>
    this.userRepository.findOne({ login: login });

  addUser: AddUserT = async (form) => {
    const user = new User(); // Create new user

    // Extract form data
    for await (const part of form) {
      // Insert field if it's a field
      if (part['value']) user[part.fieldname] = part['value'];
      // Upload if it's a file
      else if (part.file) {
        // Upload image
        const uploadedResponse = await uploadImage(
          user.id,
          part.file,
          UserStringTypes.IMAGES_FOLDER
        );
        if (uploadedResponse) user.image = uploadedResponse;
      }
    }

    if (await this.getUserByLogin(user.login)) return UserStringTypes.CONFLICT; // Check if the user does not exist
    if (!(await this.validateUserData(user, false))) return false; // Validate data

    // Save user with password hash
    return this.userRepository.save({
      ...user,
      ...{ password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)) },
    });
  };

  updateUser: UpdateUserT = async (id, form) => {
    const user = await this.getUserById(id); // Get user

    // Extract form data
    const userData: FormDataDto = {};
    for await (const part of form) {
      // If it's a field
      if (part['value']) userData[part.fieldname] = part['value'];
      // If it's a file
      else if (part.file) {
        // Upload image
        const uploadedResponse = await uploadImage(
          user.id,
          part.file,
          UserStringTypes.IMAGES_FOLDER
        );
        if (uploadedResponse) userData.image = uploadedResponse;
      }
    }
    
    if (await this.getUserByLogin(userData.login)) return UserStringTypes.CONFLICT; // Check if the user does not exist
    if (!(await this.validateUserData(userData, true))) return false; // Validate data

    // Update the user
    return this.userRepository.save({
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
    const user = await this.userRepository.findOne(id, {
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
    const deleteResult = await this.userRepository.delete(id); // Delete the user
    return deleteResult.affected; // Return a result
  };

  getUsersByRating: GetUsersByRatingT = async (num = 10) => {
    // Find users by rating in descending order
    const users = await this.userRepository.find({
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
    const user = await this.userRepository.findOne(id, {
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

    let new_ratings_count = 0,
      new_ratings_sum = 0;

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
    return this.userRepository.save({
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
