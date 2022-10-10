import { RecipeCommentT } from "./entities";

export interface RecipeCommentState {
  result: RecipeCommentT | null | boolean,
  loading: boolean;
  error: null | string;
}

export enum RecipeCommentActionTypes {
  FETCH_RECIPE_COMMENT = 'FETCH_RECIPE_COMMENT',
  FETCH_RECIPE_COMMENT_ERROR = 'FETCH_RECIPE_COMMENT_ERROR',
  FETCH_RECIPE_COMMENT_SUCCESS = 'FETCH_RECIPE_COMMENT_SUCCESS',
}

interface FetchRecipeCommentAction {
  type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT;
}
interface FetchRecipeCommentSuccessAction {
  type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_SUCCESS;
  payload: RecipeCommentT | boolean;
}
interface FetchRecipeCommentErrorAction {
  type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR;
  payload: string;
}

export type RecipeCommentAction =
  | FetchRecipeCommentAction
  | FetchRecipeCommentSuccessAction
  | FetchRecipeCommentErrorAction;
