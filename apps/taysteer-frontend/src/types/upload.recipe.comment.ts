import { RecipeCommentT } from "./entities";

export interface UploadRecipeCommentState {
  resultComment: RecipeCommentT | null,
  loading: boolean;
  error: null | string;
}

export enum UploadRecipeCommentActionTypes {
  FETCH_UPLOAD_RECIPE_COMMENT = 'FETCH_UPLOAD_RECIPE_COMMENT',
  FETCH_UPLOAD_RECIPE_COMMENT_ERROR = 'FETCH_UPLOAD_RECIPE_COMMENT_ERROR',
  FETCH_UPLOAD_RECIPE_COMMENT_SUCCESS = 'FETCH_UPLOAD_RECIPE_COMMENT_SUCCESS',
}

interface FetchUploadRecipeCommentAction {
  type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT;
}
interface FetchUploadRecipeCommentSuccessAction {
  type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_SUCCESS;
  payload: RecipeCommentT;
}
interface FetchUploadRecipeCommentErrorAction {
  type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_ERROR;
  payload: string;
}

export type UploadRecipeCommentAction =
  | FetchUploadRecipeCommentAction
  | FetchUploadRecipeCommentSuccessAction
  | FetchUploadRecipeCommentErrorAction;
