import { UserT } from "./entities";

export interface UpdateProfileState {
  profile: UserT | null;
  loading: boolean;
  error: null | string;
}

export enum UpdateProfileActionTypes {
  FETCH_UPDATE_PROFILE = 'FETCH_UPDATE_PROFILE',
  FETCH_UPDATE_PROFILE_ERROR = 'FETCH_UPDATE_PROFILE_ERROR',
  FETCH_UPDATE_PROFILE_SUCCESS = 'FETCH_UPDATE_PROFILE_SUCCESS',
}

interface FetchUpdateProfileAction {
  type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE;
}
interface FetchUpdateProfileSuccessAction {
  type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_SUCCESS;
  payload: UserT;
}
interface FetchUpdateProfileErrorAction {
  type: UpdateProfileActionTypes.FETCH_UPDATE_PROFILE_ERROR;
  payload: string;
}

export type UpdateProfileAction =
  | FetchUpdateProfileAction
  | FetchUpdateProfileSuccessAction
  | FetchUpdateProfileErrorAction;