export interface AccountState {
  account: {};
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
  payload: any;
}
interface FetchAccountErrorAction {
  type: AccountActionTypes.FETCH_ACCOUNT_ERROR;
  payload: string;
}

export type AccountAction =
  | FetchAccountAction
  | FetchAccountSuccessAction
  | FetchAccountErrorAction;
