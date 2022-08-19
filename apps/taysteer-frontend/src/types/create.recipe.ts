import { RecipeT } from "./entities";

export interface CreateRecipeState {
  recipe: RecipeT | null;
  loading: boolean;
  error: null | string;
}

export enum CreateRecipeActionTypes {
  FETCH_CREATE_RECIPE = 'FETCH_CREATE_RECIPE',
  FETCH_CREATE_RECIPE_ERROR = 'FETCH_CREATE_RECIPE_ERROR',
  FETCH_CREATE_RECIPE_SUCCESS = 'FETCH_CREATE_RECIPE_SUCCESS',
}

interface FetchCreateRecipeAction {
  type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE;
}
interface FetchCreateRecipeSuccessAction {
  type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE_SUCCESS;
  payload: RecipeT;
}
interface FetchCreateRecipeErrorAction {
  type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE_ERROR;
  payload: string;
}

export type CreateRecipeAction =
  | FetchCreateRecipeAction
  | FetchCreateRecipeSuccessAction
  | FetchCreateRecipeErrorAction;