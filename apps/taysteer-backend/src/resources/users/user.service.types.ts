import { UserDataDto } from './user.dto';
import { UserMinT, UserT } from './user.types';
import { MultipartFile } from 'fastify-multipart';

export type CreateAdminT = () => void;
export type CheckAccessT = (user: UserMinT, requestedId: string, shouldBeOwner: boolean) => Promise<boolean>;
export type ValidateUserDataT = (userData: UserDataDto | UserT, updating: boolean) => Promise<boolean>;
export type GetAllT = () => Promise<Array<UserT>>;
export type GetByIdT = (id: string) => Promise<UserT | undefined>;
export type GetByLoginT = (login: string) => Promise<UserT | undefined>;
export type AddUserT = (data: AsyncIterableIterator<MultipartFile>) => Promise<UserT | false | string>;
export type UpdateUserT = (id: string, data: AsyncIterableIterator<MultipartFile>) => Promise<UserT | false>;
export type DeleteUserT = (id: string) => Promise<number | false>;
export type GetUsersByRatingT = (num: number) => Promise<Array<UserT>>;
export type RateUserT = (id: string, raterId: string, rating: number) => Promise<UserT | false>;

export enum UserStringTypes {
  IMAGE = 'image',
  CONFLICT = 'conflict',
  IMAGES_FOLDER = 'user_avatar',
}
