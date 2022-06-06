interface RecipeT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
}

export interface RecipeState {
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
interface SetRecipesPage {
  type: RecipeActionTypes.SET_RECIPES_PAGE;
  payload: number;
}

export type RecipeAction =
  | FetchRecipeAction
  | FetchRecipeSuccessAction
  | FetchRecipeErrorAction
  | SetRecipesPage;
