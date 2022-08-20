import { RecipeT } from "./entities";

export interface UploadRecipeState {
  recipe: RecipeT | null;
  loading: boolean;
  error: null | string;
}

export enum UploadRecipeActionTypes {
  FETCH_UPLOAD_RECIPE = 'FETCH_UPLOAD_RECIPE',
  FETCH_UPLOAD_RECIPE_ERROR = 'FETCH_UPLOAD_RECIPE_ERROR',
  FETCH_UPLOAD_RECIPE_SUCCESS = 'FETCH_UPLOAD_RECIPE_SUCCESS',
}

interface FetchUploadRecipeAction {
  type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE;
}
interface FetchUploadRecipeSuccessAction {
  type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_SUCCESS;
  payload: RecipeT;
}
interface FetchUploadRecipeErrorAction {
  type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_ERROR;
  payload: string;
}

export type UploadRecipeAction =
  | FetchUploadRecipeAction
  | FetchUploadRecipeSuccessAction
  | FetchUploadRecipeErrorAction;