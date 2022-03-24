import { UserDataDto } from './user.dto';
import { UserMinT, UserT } from './user.types';

type CheckAccessT = (user: UserMinT, requestedId: string, shouldBeOwner: boolean) => Promise<boolean>;
type ValidateUserDataT = (userData: UserDataDto | UserT, updating: boolean) => Promise<boolean>;
type GetAllT = () => Promise<Array<UserT>>;
type GetByIdT = (id: string) => Promise<UserT | undefined>;
type GetByLoginT = (login: string) => Promise<UserT | undefined>;
type AddUserT = (userData: UserDataDto | UserT, files?: AsyncIterableIterator<NodeJS.ReadableStream>) => Promise<UserT | false>;
type UpdateUserT = (id: string, userData: UserDataDto | UserT, files?: AsyncIterableIterator<NodeJS.ReadableStream>) => Promise<UserT | false>;
type DeleteUserT = (id: string) => Promise<number | false>;
type GetUsersByRatingT = (num: number) => Promise<Array<UserT>>;
type RateUserT = (id: string, raterId: string, rating: number) => Promise<UserT | false>;

enum UserStringTypes {
  IMAGES_FOLDER = 'user_avatar',
}

export {
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
};
