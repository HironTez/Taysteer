import { RegisterUserDataDto } from './user.dto';
import { UserMinT, UserT } from './user.types';

export type CheckAccessT = (user: UserMinT, requestedId: string, shouldBeOwner: boolean) => Promise<boolean>;
export type ValidateUserDataT = (userData: RegisterUserDataDto | UserT, updating: boolean) => Promise<boolean>;
export type GetAllT = () => Promise<Array<UserT>>;
export type GetByIdT = (id: string) => Promise<UserT | undefined>;
export type GetByLoginT = (login: string) => Promise<UserT | undefined>;
export type AddUserT = (userData: RegisterUserDataDto | UserT, files?: AsyncIterableIterator<NodeJS.ReadableStream>) => Promise<UserT | false>;
export type UpdateUserT = (id: string, userData: RegisterUserDataDto | UserT, files?: AsyncIterableIterator<NodeJS.ReadableStream>) => Promise<UserT | false>;
export type DeleteUserT = (id: string) => Promise<number | false>;
export type GetUsersByRatingT = (num: number) => Promise<Array<UserT>>;
export type RateUserT = (id: string, raterId: string, rating: number) => Promise<UserT | false>;

export enum UserStringTypes {
  IMAGES_FOLDER = 'user_avatar',
}
