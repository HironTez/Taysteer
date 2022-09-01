import { RecipeCommentT } from './entities';

export interface RecipeCommentsState {
  comments: RecipeCommentT[];
  loading: boolean;
  error: null | string;
  page: number;
}

export enum RecipeCommentsActionTypes {
  FETCH_RECIPE_COMMENTS = 'FETCH_RECIPE_COMMENTS',
  FETCH_RECIPE_COMMENTS_ERROR = 'FETCH_RECIPE_COMMENTS_ERROR',
  FETCH_RECIPE_COMMENTS_SUCCESS = 'FETCH_RECIPE_COMMENTS_SUCCESS',
  SET_RECIPE_COMMENTS_PAGE = 'SET_RECIPE_COMMENTS_PAGE',
  CLEAR_RECIPE_COMMENT_LIST = 'CLEAR_RECIPE_COMMENT_LIST',
  FETCH_COMMENT_ANSWERS = 'FETCH_COMMENT_ANSWERS',
  FETCH_COMMENT_ANSWERS_SUCCESS = 'FETCH_COMMENT_ANSWERS_SUCCESS',
  FETCH_COMMENT_ANSWERS_ERROR = 'FETCH_COMMENT_ANSWERS_ERROR',
}

interface FetchRecipeCommentsAction {
  type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS;
}
interface FetchRecipeCommentsSuccessAction {
  type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_SUCCESS;
  payload: RecipeCommentT[];
}
interface FetchRecipeCommentsErrorAction {
  type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_ERROR;
  payload: string;
}
interface SetRecipeCommentsPage {
  type: RecipeCommentsActionTypes.SET_RECIPE_COMMENTS_PAGE;
  payload: number;
}
interface ClearRecipeCommentList {
  type: RecipeCommentsActionTypes.CLEAR_RECIPE_COMMENT_LIST;
}
interface FetchCommentAnswersAction {
  type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS;
}
interface FetchCommentAnswersSuccessAction {
  type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_SUCCESS;
  payload: RecipeCommentT;
}
interface FetchCommentAnswersErrorAction {
  type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_ERROR;
  payload: string;
}

export type RecipeCommentsActions =
  | FetchRecipeCommentsAction
  | FetchRecipeCommentsSuccessAction
  | FetchRecipeCommentsErrorAction
  | SetRecipeCommentsPage
  | ClearRecipeCommentList
  | FetchCommentAnswersAction
  | FetchCommentAnswersSuccessAction
  | FetchCommentAnswersErrorAction;
