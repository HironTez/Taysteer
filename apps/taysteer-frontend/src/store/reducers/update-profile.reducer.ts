import { UpdateProfileAction, UpdateProfileActionTypes, UpdateProfileState } from "../../types/update.profile";

const initialState: UpdateProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const updateProfileReducer = (
  state: UpdateProfileState = initialState,
  action: UpdateProfileAction
): UpdateProfileState => {
  switch (action.type) {
    case UpdateProfileActionTypes.FETCH_UPDATE_PROFILE:
      return { ...state, loading: true, error: null };
    case UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_SUCCESS:
      return {
        profile: action.payload,
        loading: false,
        error: null,
      };
    case UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
