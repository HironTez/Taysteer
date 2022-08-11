import { UserT } from './entities';

export interface AccountState {
  account: UserT | null;
  loading: boolean;
  error: null | string;
}

export enum AccountActionTypes {
  FETCH_ACCOUNT = 'FETCH_ACCOUNT',
  FETCH_ACCOUNT_ERROR = 'FETCH_ACCOUNT_ERROR',
  FETCH_ACCOUNT_SUCCESS = 'FETCH_ACCOUNT_SUCCESS',
}

interface FetchAccountAction {
  type: AccountActionTypes.FETCH_ACCOUNT;
}
interface FetchAccountSuccessAction {
  type: AccountActionTypes.FETCH_ACCOUNT_SUCCESS;
  payload: UserT;
}
interface FetchAccountErrorAction {
  type: AccountActionTypes.FETCH_ACCOUNT_ERROR;
  payload: string;
}

export type AccountAction =
  | FetchAccountAction
  | FetchAccountSuccessAction
  | FetchAccountErrorAction;
