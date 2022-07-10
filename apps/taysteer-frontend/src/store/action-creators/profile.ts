import { AccountAction, AccountActionTypes } from './../../types/account';
import { Dispatch } from 'react';

export const fetchProfile = (userId: string) => {
  return async (dispatch: Dispatch<AccountAction>) => {
    try {
      dispatch({ type: AccountActionTypes.FETCH_ACCOUNT });
      const response = await fetch(
        `/api/users/${userId || 'me'}?detailed=false`
      );
      if (response.status === 404) {
        dispatch({
          type: AccountActionTypes.FETCH_ACCOUNT_ERROR,
          payload: 'User not found',
        });
        return;
      } else if (response.status !== 200) {
        dispatch({
          type: AccountActionTypes.FETCH_ACCOUNT_ERROR,
          payload: 'Error on account loading',
        });
        return;
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
