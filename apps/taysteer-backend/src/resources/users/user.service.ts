import { Recipe } from './../recipes/recipe.model';
import { UserDataDto } from './user.dto';
import {
  CreateAdminT,
  GetByIdT,
  GetByLoginT,
  AddUserT,
  UpdateUserT,
  DeleteUserT,
  GetUsersByRatingT,
  CheckAccessT,
  ValidateUserDataT,
  UserStringTypes,
  DeleteUserImageT,
  GetUserRecipesT,
  IsAdminT,
} from './user.service.types';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import {
  ADMIN_LOGIN,
  ADMIN_PASSWORD,
} from '../../../../../configs/common/config';
import { deleteImage, uploadImage } from '../../utils/image.uploader';
import { loadObject } from '../../utils/promise.loader';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>
  ) {
    this.createAdmin();
  }

  createAdmin: CreateAdminT = async () => {
    const adminExists = await this.userRepository.findOne({
      login: ADMIN_LOGIN,
    });
    if (!adminExists) {
      const admin = new User({ login: ADMIN_LOGIN, password: ADMIN_PASSWORD });
      this.userRepository.save(
        await loadObject({
          ...admin,
          ...{
            password: bcrypt.hash(ADMIN_PASSWORD, bcrypt.genSaltSync(10)),
          },
        })
      );
    }
  };

  isAdmin: IsAdminT = async (userId) =>
    (await this.getUserByLogin(ADMIN_LOGIN))?.id === userId;

  checkAccess: CheckAccessT = async (
    user,
    requestedId,
    shouldBeOwner = true
  ) => {
    const userExists = await this.getUserById(requestedId);
    const isOwner = user.id == requestedId;
    const isAdmin = await this.isAdmin(user.id);
    return Boolean(userExists && (isOwner == shouldBeOwner || isAdmin));
  };

  validateUserData: ValidateUserDataT = async (userData, updating = false) => {
    if (!updating) {
      // If it's a data for creating a new user
      if (!userData.password) return false; // Check if the login and password exists
    }
    if (!userData.login || !userData.password) return false;
    if (userData.login?.length > 50 || userData.password?.length > 50)
      return false;
    if (updating && (!userData.name || !userData.description)) return false;
    if (
      updating &&
      userData.name &&
      userData.description &&
      (userData.name?.length > 50 || userData.description?.length > 500)
    )
      return false;
    return true;
  };

  getUserById: GetByIdT = (id) => this.userRepository.findOne(id);

  getUserByLogin: GetByLoginT = (login) =>
    this.userRepository.findOne({ login: login });

  addUser: AddUserT = async (form) => {
    const userData = new UserDataDto(); // Create the object for user data

    // Extract form data
    for await (const part of form) {
      // Insert field if it's a field
      if (part['value']) userData[String(part.fieldname)] = part['value'];
      // Upload if it's a file
      else if (part.file) {
        // Upload image
        const uploadedResponse = await uploadImage(
          part.file,
          UserStringTypes.IMAGES_FOLDER
        );
        if (uploadedResponse) userData.image = uploadedResponse;
        break;
      }
    }

    if (!userData.login) return false;
    if (await this.getUserByLogin(userData.login))
      return UserStringTypes.CONFLICT; // Check if the user does not exist
    if (!(await this.validateUserData(userData, false))) return false; // Validate data

    const user = this.userRepository.create(new User(userData)); // Create user object

    // Save user with password hash
    return this.userRepository.save({
      ...user,
      ...{ password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)) },
    });
  };

  updateUser: UpdateUserT = async (id, form) => {
    const user = await this.getUserById(id); // Get user
    if (!user) return UserStringTypes.NOT_FOUND;

    const userData = new UserDataDto();
    // Extract form data
    for await (const part of form) {
      // If it's a field
      if (part['value']) userData[part.fieldname] = part['value'];
      // If it's a file
      else if (part.file) {
        // Upload image
        const uploadedResponse = await uploadImage(
          part.file,
          UserStringTypes.IMAGES_FOLDER
        );
        if (uploadedResponse) userData.image = uploadedResponse;
        break;
      }
    }

    // Check if the user with the same login does not exist
    if (!userData.login) return false;
    if (
      userData.login !== user.login &&
      (await this.getUserByLogin(userData.login))
    )
      return UserStringTypes.CONFLICT;
    if (!(await this.validateUserData(userData, true))) return false; // Validate data

    // Delete old image from the server
    if (userData.image && user.image) {
      deleteImage(user.image);
    }

    // Create the user object with the new data
    const newUser = new User({
      ...userData,
      ...{ login: userData.login || user.login, update: true },
    });

    // Update the user
    return this.userRepository.save({
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
    const user = await this.getUserById(id);
    if (!user) return false;
    if (user.image) deleteImage(user.image); // Delete the image
    const deleteResult = await this.userRepository.delete(id); // Delete the user
    return Boolean(deleteResult.affected); // Return a result
  };

  getUsersByRating: GetUsersByRatingT = async (page = 1) => {
    // Find users by rating in descending order
    const users = await this.userRepository.find({
      order: { rating: 'DESC' },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
    return users;
  };

  deleteUserImage: DeleteUserImageT = async (userId) => {
    const user = await this.getUserById(userId);
    if (!user) return false;
    const deleted = await deleteImage(user.image);
    if (deleted) {
      return this.userRepository.save({ ...user, ...{ image: '' } });
    } else return false;
  };

  getUserRecipes: GetUserRecipesT = async (userId, page = 1) => {
    const user = await this.getUserById(userId);
    return await this.recipeRepository.find({
      relations: [UserStringTypes.USER],
      where: { user: user },
      order: { rating: 'DESC' },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
  };
}
