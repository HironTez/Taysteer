import {
  DeleteProfileAction,
  DeleteProfileActionTypes,
  DeleteProfileState,
} from '../../types/delete.profile';

const initialState: DeleteProfileState = {
  success: false,
  loading: false,
  error: null,
};

export const deleteProfileReducer = (
  state: DeleteProfileState = initialState,
  action: DeleteProfileAction
): DeleteProfileState => {
  switch (action.type) {
    case DeleteProfileActionTypes.FETCH_DELETE_PROFILE:
      return { success: false, loading: true, error: null };
    case DeleteProfileActionTypes.FETCH_DELETE_PROFILE_SUCCESS:
      return {
        success: action.payload,
        loading: false,
        error: null,
      };
    case DeleteProfileActionTypes.FETCH_DELETE_PROFILE_ERROR:
      return { success: false, loading: false, error: action.payload };
    default:
      return state;
  }
};
