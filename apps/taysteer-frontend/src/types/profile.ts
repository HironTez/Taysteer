import { ProfileDetailedT } from "./entities";

export interface ProfileState {
  profile: ProfileDetailedT | null;
  loading: boolean;
  error: null | string;
}

export enum ProfileActionTypes {
  FETCH_RECIPE = 'FETCH_RECIPE',
  FETCH_RECIPE_ERROR = 'FETCH_RECIPE_ERROR',
  FETCH_RECIPE_SUCCESS = 'FETCH_RECIPE_SUCCESS',
}

interface FetchProfileAction {
  type: ProfileActionTypes.FETCH_RECIPE;
}
interface FetchProfileSuccessAction {
  type: ProfileActionTypes.FETCH_RECIPE_SUCCESS;
  payload: any;
}
interface FetchProfileErrorAction {
  type: ProfileActionTypes.FETCH_RECIPE_ERROR;
  payload: string;
}

export type ProfileAction =
  | FetchProfileAction
  | FetchProfileSuccessAction
  | FetchProfileErrorAction;
