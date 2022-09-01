import { Dispatch } from 'react';
import {
  RecipeCommentsActions,
  RecipeCommentsActionTypes,
} from '../../types/recipe.comments';

export const fetchRecipeComments = (recipeId: string, page = 1) => {
  return async (dispatch: Dispatch<RecipeCommentsActions>) => {
    try {
      dispatch({ type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS });
      const response = await fetch(
        `/api/recipes/${recipeId}/comments?page=${page}`
      );
      if (response.status !== 200) {
        dispatch({
          type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_ERROR,
          payload: 'Error on comments loading',
        });
        return;
      }
      const responseJson = await response.json();
      dispatch({
        type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_SUCCESS,
        payload: responseJson,
      });
    } catch {
      dispatch({
        type: RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_ERROR,
        payload: 'Error on comments loading',
      });
    }
  };
};

export const setRecipeCommentsPage = (page: number): RecipeCommentsActions => {
  return {
    type: RecipeCommentsActionTypes.SET_RECIPE_COMMENTS_PAGE,
    payload: page,
  };
};

export const clearRecipeCommentsList = (): RecipeCommentsActions => {
  return {
    type: RecipeCommentsActionTypes.CLEAR_RECIPE_COMMENT_LIST,
  };
};

export const fetchRecipeCommentAnswers = (commentId: string, page = 1) => {
  return async (dispatch: Dispatch<RecipeCommentsActions>) => {
    try {
      dispatch({ type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS });
      const response = await fetch(
        `/api/recipes/comments/${commentId}?page=${page}`
      );
      if (response.status !== 200) {
        dispatch({
          type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_ERROR,
          payload: 'Error on comments loading',
        });
        return;
      }
      const responseJson = await response.json();
      // const commentTemplate: RecipeCommentT = {
      //   updated: boolean;
      //   countOfChildComments: number;
      //   childComments: Array<RecipeCommentT>;
      //   page: number;
      // }
      dispatch({
        type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_SUCCESS,
        payload: { ...responseJson, ...{ page: page } },
      });
    } catch {
      dispatch({
        type: RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_ERROR,
        payload: 'Error on comments loading',
      });
    }
  };
};
