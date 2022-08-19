import { ProfileAction, ProfileActionTypes } from './../../types/profile';
import { Dispatch } from 'react';

export const fetchProfile = (userId: string | undefined) => {
  return async (dispatch: Dispatch<ProfileAction>) => {
    try {
      dispatch({ type: ProfileActionTypes.FETCH_PROFILE });
      const response = await fetch(
        `/api/users/${userId || 'me'}?detailed=true`
      );
      if (response.status === 404) {
        dispatch({
          type: ProfileActionTypes.FETCH_PROFILE_ERROR,
          payload: 'User not found',
        });
        return;
      } else if (response.status !== 200) {
        dispatch({
          type: ProfileActionTypes.FETCH_PROFILE_ERROR,
          payload: 'Error on account loading',
        });
        return;
      }
      const responseJson = await response.json();
      dispatch({
        type: ProfileActionTypes.FETCH_PROFILE_SUCCESS,
        payload: responseJson,
      });
    } catch {
      dispatch({
        type: ProfileActionTypes.FETCH_PROFILE_ERROR,
        payload: 'Error on account loading',
      });
    }
  };
};
