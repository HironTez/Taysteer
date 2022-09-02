import { RecipeT } from './entities';

export interface RecipesState {
  recipes: RecipeT[];
  loading: boolean;
  error: null | string;
  end: boolean;
  page: number;
}

export enum RecipeActionTypes {
  FETCH_RECIPES = 'FETCH_RECIPES',
  FETCH_RECIPES_ERROR = 'FETCH_RECIPES_ERROR',
  FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS',
  SET_RECIPES_PAGE = 'SET_RECIPES_PAGE',
  CLEAR_RECIPES = 'CLEAR_RECIPES',
}

interface FetchRecipeActions {
  type: RecipeActionTypes.FETCH_RECIPES;
}
interface FetchRecipesSuccessAction {
  type: RecipeActionTypes.FETCH_RECIPES_SUCCESS;
  payload: RecipeT[];
}
interface FetchRecipesErrorAction {
  type: RecipeActionTypes.FETCH_RECIPES_ERROR;
  payload: string;
}
interface SetRecipesPage {
  type: RecipeActionTypes.SET_RECIPES_PAGE;
  payload: number;
}
interface ClearRecipeList {
  type: RecipeActionTypes.CLEAR_RECIPES;
}

export type RecipeActions =
  | FetchRecipeActions
  | FetchRecipesSuccessAction
  | FetchRecipesErrorAction
  | SetRecipesPage
  | ClearRecipeList;
