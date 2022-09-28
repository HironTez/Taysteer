export interface DeleteRecipeState {
  success: boolean;
  loading: boolean;
  error: null | string;
}

export enum DeleteRecipeActionTypes {
  FETCH_DELETE_RECIPE = 'FETCH_DELETE_RECIPE',
  FETCH_DELETE_RECIPE_ERROR = 'FETCH_DELETE_RECIPE_ERROR',
  FETCH_DELETE_RECIPE_SUCCESS = 'FETCH_DELETE_RECIPE_SUCCESS',
}

interface FetchDeleteRecipeAction {
  type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE;
}
interface FetchDeleteRecipeSuccessAction {
  type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_SUCCESS;
  payload: boolean;
}
interface FetchDeleteRecipeErrorAction {
  type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_ERROR;
  payload: string;
}

export type DeleteRecipeAction =
  | FetchDeleteRecipeAction
  | FetchDeleteRecipeSuccessAction
  | FetchDeleteRecipeErrorAction;
