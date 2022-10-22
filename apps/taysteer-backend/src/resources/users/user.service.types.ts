import { Recipe } from './../recipes/recipe.model';
import { UserDataDto } from './user.dto';
import { UserMinT } from './user.types';
import { User } from './user.model';
import { ExtendedMultipartFile } from '../../typification/interfaces';

export type CreateAdminT = () => void;
export type IsAdminT = (userId: string) => Promise<boolean>;
export type CheckAccessT = (user: UserMinT, requestedId: string, shouldBeOwner: boolean) => Promise<boolean>;
export type ValidateUserDataT = (userData: UserDataDto | User, updating: boolean) => Promise<boolean>;
export type GetByIdT = (id: string) => Promise<User | undefined>;
export type GetByLoginT = (login: string) => Promise<User | undefined>;
export type AddUserT = (data: AsyncIterableIterator<ExtendedMultipartFile>) => Promise<User | false | string>;
export type UpdateUserT = (id: string, data: AsyncIterableIterator<ExtendedMultipartFile>) => Promise<User | false | string>;
export type DeleteUserT = (id: string) => Promise<boolean>;
export type GetUsersByRatingT = (page: number) => Promise<Array<User>>;
export type DeleteUserImageT = (userId: string) => Promise<User | false>;
export type GetUserRecipesT = (userId: string, page: number) => Promise<Array<Recipe>>;

export enum UserStringTypes {
  IMAGE = 'image',
  CONFLICT = 'conflict',
  NOT_FOUND = 'not_found',
  IMAGES_FOLDER = 'user_avatar',
  RECIPES = 'recipes',
  USER = 'user',
  RATING = 'rating',
}
