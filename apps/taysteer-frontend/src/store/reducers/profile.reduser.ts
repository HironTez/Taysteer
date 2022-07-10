import {
  ProfileAction,
  ProfileActionTypes,
  ProfileState,
} from '../../types/profile';

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileReducer = (
  state: ProfileState = initialState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case ProfileActionTypes.FETCH_RECIPE:
      return { ...state, loading: true, error: null };
    case ProfileActionTypes.FETCH_RECIPE_SUCCESS:
      return {
        profile: action.payload,
        loading: false,
        error: null,
      };
    case ProfileActionTypes.FETCH_RECIPE_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
