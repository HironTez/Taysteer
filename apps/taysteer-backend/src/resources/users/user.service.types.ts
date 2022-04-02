import { UserDataDto } from './user.dto';
import { UserMinT } from './user.types';
import { MultipartFile } from 'fastify-multipart';
import { User } from './user.model';

export type CreateAdminT = () => void;
export type CheckAccessT = (user: UserMinT, requestedId: string, shouldBeOwner: boolean) => Promise<boolean>;
export type ValidateUserDataT = (userData: UserDataDto | User, updating: boolean) => Promise<boolean>;
export type GetByIdT = (id: string) => Promise<User | undefined>;
export type GetByLoginT = (login: string) => Promise<User | undefined>;
export type AddUserT = (data: AsyncIterableIterator<MultipartFile>) => Promise<User | false | string>;
export type UpdateUserT = (id: string, data: AsyncIterableIterator<MultipartFile>) => Promise<User | false | string>;
export type DeleteUserT = (id: string) => Promise<number>;
export type GetUsersByRatingT = (page: number) => Promise<Array<User>>;
export type RateUserT = (id: string, raterId: string, rating: number) => Promise<User | false>;
export type DeleteUserImageT = (userId: string) => Promise<User | false>;

export enum UserStringTypes {
  IMAGE = 'image',
  CONFLICT = 'conflict',
  IMAGES_FOLDER = 'user_avatar',
  RECIPES = 'recipes',
  RATER = 'rater',
  RATERS = 'raters',
  USER = 'user'
}
