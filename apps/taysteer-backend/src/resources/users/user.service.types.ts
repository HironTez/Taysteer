import { DeleteResult } from 'typeorm';
import { UserT } from './user.type';

type GetAllT = () => Promise<Array<UserT>>;
type GetByIdT = (id: string) => Promise<UserT | undefined>;
type GetByLoginT = (login: string) => Promise<UserT | undefined>;
type AddUserT = (user: UserT) => Promise<UserT | false>;
type UpdateUserT = (id: string, newUser: UserT) => Promise<UserT | false>;
type DeleteUserT = (id: string) => Promise<DeleteResult>;

export { GetAllT, GetByIdT, GetByLoginT, AddUserT, UpdateUserT, DeleteUserT };
