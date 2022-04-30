export interface RecipeState {
  recipes: any[];
  loading: boolean;
  error: null | string;
}

export enum RecipeActionTypes {
  FETCH_RECIPES = 'FETCH_RECIPES',
  FETCH_RECIPES_ERROR = 'FETCH_RECIPES_ERROR',
  FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS',
}

interface FetchRecipeAction {
  type: RecipeActionTypes.FETCH_RECIPES;
}
interface FetchRecipeSuccessAction {
  type: RecipeActionTypes.FETCH_RECIPES_SUCCESS;
  payload: any;
}
interface FetchRecipeErrorAction {
  type: RecipeActionTypes.FETCH_RECIPES_ERROR;
  payload: string;
}

export type RecipeAction =
  | FetchRecipeAction
  | FetchRecipeSuccessAction
  | FetchRecipeErrorAction;
