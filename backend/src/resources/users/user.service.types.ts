import { UserT } from './user.type';

type GetAllT = () => Promise<Array<UserT>>;
type GetByIdT = (id: string) => Promise<UserT | undefined>;
type AddUserT = (user: UserT) => Promise<UserT>;
type UpdateUserT = (id: string, newUser: UserT) => Promise<UserT>;
type DeleteUserT = (id: string) => void;

export { GetAllT, GetByIdT, AddUserT, UpdateUserT, DeleteUserT };