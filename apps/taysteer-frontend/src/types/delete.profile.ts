export interface DeleteProfileState {
  success: boolean;
  loading: boolean;
  error: null | string;
}

export enum DeleteProfileActionTypes {
  FETCH_DELETE_PROFILE = 'FETCH_DELETE_PROFILE',
  FETCH_DELETE_PROFILE_ERROR = 'FETCH_DELETE_PROFILE_ERROR',
  FETCH_DELETE_PROFILE_SUCCESS = 'FETCH_DELETE_PROFILE_SUCCESS',
}

interface FetchDeleteProfileAction {
  type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE;
}
interface FetchDeleteProfileSuccessAction {
  type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_SUCCESS;
  payload: boolean;
}
interface FetchDeleteProfileErrorAction {
  type: DeleteProfileActionTypes.FETCH_DELETE_PROFILE_ERROR;
  payload: string;
}

export type DeleteProfileAction =
  | FetchDeleteProfileAction
  | FetchDeleteProfileSuccessAction
  | FetchDeleteProfileErrorAction;
