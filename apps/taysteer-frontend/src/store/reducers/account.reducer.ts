import { AccountActionTypes } from '../../types/account';
import { AccountAction, AccountState } from "../../types/account";

const initialState: AccountState = {
  account: null,
  loading: false,
  error: null,
};

export const accountReducer = (
  state: AccountState = initialState,
  action: AccountAction
): AccountState => {
  switch (action.type) {
    case AccountActionTypes.FETCH_ACCOUNT:
      return { ...state, loading: true, error: null };
    case AccountActionTypes.FETCH_ACCOUNT_SUCCESS:
      return {
        account: action.payload,
        loading: false,
        error: null,
      };
    case AccountActionTypes.FETCH_ACCOUNT_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
