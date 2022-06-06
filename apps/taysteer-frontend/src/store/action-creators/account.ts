import { AccountAction, AccountActionTypes } from './../../types/account';
import { Dispatch } from 'react';

export const fetchAccount = () => {
  return async (dispatch: Dispatch<AccountAction>) => {
    try {
      dispatch({ type: AccountActionTypes.FETCH_ACCOUNT });
      const response = await fetch(
        `/api/users/me?detailed=false`
      );
      if (response.status === 401) {
        dispatch({
          type: AccountActionTypes.FETCH_ACCOUNT_ERROR,
          payload: 'Unauthorized',
        });
        return
      }
      const responseJson = await response.json();
      dispatch({
        type: AccountActionTypes.FETCH_ACCOUNT_SUCCESS,
        payload: responseJson,
      });
    } catch (e) {
      dispatch({
        type: AccountActionTypes.FETCH_ACCOUNT_ERROR,
        payload: 'Error on account loading',
      });
    }
  };
};
