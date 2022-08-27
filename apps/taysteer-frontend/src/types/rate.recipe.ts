export interface RateRecipeState {
  loading: boolean;
  error: null | string;
}

export enum RateRecipeActionTypes {
  FETCH_RATE_RECIPE = 'FETCH_RATE_RECIPE',
  FETCH_RATE_RECIPE_ERROR = 'FETCH_RATE_RECIPE_ERROR',
  FETCH_RATE_RECIPE_SUCCESS = 'FETCH_RATE_RECIPE_SUCCESS',
}

interface FetchRateRecipeAction {
  type: RateRecipeActionTypes.FETCH_RATE_RECIPE;
}
interface FetchRateRecipeSuccessAction {
  type: RateRecipeActionTypes.FETCH_RATE_RECIPE_SUCCESS;
  payload: true;
}
interface FetchRateRecipeErrorAction {
  type: RateRecipeActionTypes.FETCH_RATE_RECIPE_ERROR;
  payload: string;
}

export type RateRecipeAction =
  | FetchRateRecipeAction
  | FetchRateRecipeSuccessAction
  | FetchRateRecipeErrorAction;
