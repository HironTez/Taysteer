import { RecipeT } from './entities';

export interface RecipesState {
  recipes: RecipeT[];
  loading: boolean;
  error: null | string;
  end: boolean;
  page: number;
}

export enum RecipesActionTypes {
  FETCH_RECIPES = 'FETCH_RECIPES',
  FETCH_RECIPES_ERROR = 'FETCH_RECIPES_ERROR',
  FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS',
  SET_RECIPES_PAGE = 'SET_RECIPES_PAGE',
  CLEAR_RECIPES = 'CLEAR_RECIPES',
}

interface FetchRecipesAction {
  type: RecipesActionTypes.FETCH_RECIPES;
}
interface FetchRecipesSuccessAction {
  type: RecipesActionTypes.FETCH_RECIPES_SUCCESS;
  payload: any;
}
interface FetchRecipesErrorAction {
  type: RecipesActionTypes.FETCH_RECIPES_ERROR;
  payload: string;
}
interface SetRecipesPage {
  type: RecipesActionTypes.SET_RECIPES_PAGE;
  payload: number;
}
interface ClearRecipes {
  type: RecipesActionTypes.CLEAR_RECIPES;
}

export type RecipesAction =
  | FetchRecipesAction
  | FetchRecipesSuccessAction
  | FetchRecipesErrorAction
  | SetRecipesPage
  | ClearRecipes;
