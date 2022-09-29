import { Dispatch } from 'react';
import {
  DeleteProfileAction,
  DeleteProfileActionTypes,
} from '../../types/delete.profile';

export const fetchDeleteProfile = (user_id: string) => {
  return async (dispatch: Dispatch<DeleteProfileAction>) => {
    try {
      dispatch({ type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE });
      const response = await fetch(`/api/users?user_id=${user_id}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        dispatch({
          type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_SUCCESS,
          payload: true,
        });
      } else if (response.status === 401) {
        dispatch({
          type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_ERROR,
          payload: 'Unauthorized',
        });
        return;
      } else if (response.status !== 200) {
        dispatch({
          type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_ERROR,
          payload: 'Error on rating',
        });
        return;
      }
    } catch {
      dispatch({
        type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_ERROR,
        payload: 'Error on rating',
      });
    }
  };
};

export const deleteProfileHandled = () => {
  return async (dispatch: Dispatch<DeleteProfileAction>) => {
    dispatch({
      type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_SUCCESS,
      payload: false,
    });
  };
};
