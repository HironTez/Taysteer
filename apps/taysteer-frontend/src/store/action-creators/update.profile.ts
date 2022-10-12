import { Dispatch } from 'react';
import {
  UpdateProfileAction,
  UpdateProfileActionTypes,
} from '../../types/update.profile';
import $ from 'jquery';

export const fetchUpdateProfile = (profile: FormData, userId: string) => {
  return async (dispatch: Dispatch<UpdateProfileAction>) => {
    try {
      dispatch({ type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE });
      $.ajax({
        url: `/api/users?user_id=${userId}`,
        method: 'PUT',
        processData: false,
        contentType: false,
        data: profile,
        enctype: 'multipart/form-data',
      })
        .done((response) => {
          dispatch({
            type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_SUCCESS,
            payload: response,
          });
        })
        .fail((error) => {
          if (error.status === 401) {
            dispatch({
              type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_ERROR,
              payload: 'Unauthorized',
            });
          } else {
            dispatch({
              type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_ERROR,
              payload: 'Error on profile uploading',
            });
          }
        });
    } catch {
      dispatch({
        type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_ERROR,
        payload: 'Error on profile uploading',
      });
    }
  };
};
