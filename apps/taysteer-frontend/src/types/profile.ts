import { ProfileDetailedT } from './entities';

export interface ProfileState {
  profile: ProfileDetailedT | null;
  loading: boolean;
  error: null | string;
}

export enum ProfileActionTypes {
  FETCH_PROFILE = 'FETCH_PROFILE',
  FETCH_PROFILE_ERROR = 'FETCH_PROFILE_ERROR',
  FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS',
}

interface FetchProfileAction {
  type: ProfileActionTypes.FETCH_PROFILE;
}
interface FetchProfileSuccessAction {
  type: ProfileActionTypes.FETCH_PROFILE_SUCCESS;
  payload: ProfileDetailedT;
}
interface FetchProfileErrorAction {
  type: ProfileActionTypes.FETCH_PROFILE_ERROR;
  payload: string;
}

export type ProfileAction =
  | FetchProfileAction
  | FetchProfileSuccessAction
  | FetchProfileErrorAction;
