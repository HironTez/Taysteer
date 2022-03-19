import { DeleteResult } from 'typeorm';
import { UserMinT, UserT } from './user.types';

type CheckAccessT = (user: UserMinT, requestedId: string, shouldBeOwner: boolean) => Promise<boolean>;
type ValidateUserDataT = (user: UserT) => Promise<boolean>;
type GetAllT = () => Promise<Array<UserT>>;
type GetByIdT = (id: string) => Promise<UserT | undefined>;
type GetByLoginT = (login: string) => Promise<UserT | undefined>;
type AddUserT = (user: UserT) => Promise<UserT | false>;
type UpdateUserT = (id: string, newUser: UserT) => Promise<UserT | false>;
type DeleteUserT = (id: string) => Promise<DeleteResult>;
type GetUsersByRatingT = (num: number) => Promise<Array<UserT>>;
type RateUserT = (id: string, raterId: string, rating: number) => Promise<UserT | false>;
type ChangeUserImageT = (id: string, fileReadStream: NodeJS.ReadableStream) => Promise<UserT | false>;
type DeleteUserImageT = (id: string) => Promise<UserT | false>;

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
  ChangeUserImageT,
  DeleteUserImageT,
  UserStringTypes,
};
