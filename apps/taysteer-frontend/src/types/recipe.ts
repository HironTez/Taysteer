import { RecipeDetailedT } from './entities';

export interface RecipeState {
  recipe: RecipeDetailedT | null;
  loading: boolean;
  error: null | string;
}

export enum RecipeActionTypes {
  FETCH_RECIPE = 'FETCH_RECIPE',
  FETCH_RECIPE_ERROR = 'FETCH_RECIPE_ERROR',
  FETCH_RECIPE_SUCCESS = 'FETCH_RECIPE_SUCCESS',
}

interface FetchRecipeAction {
  type: RecipeActionTypes.FETCH_RECIPE;
}
interface FetchRecipeSuccessAction {
  type: RecipeActionTypes.FETCH_RECIPE_SUCCESS;
  payload: RecipeDetailedT;
}
interface FetchRecipeErrorAction {
  type: RecipeActionTypes.FETCH_RECIPE_ERROR;
  payload: string;
}

export type RecipeAction =
  | FetchRecipeAction
  | FetchRecipeSuccessAction
  | FetchRecipeErrorAction;
