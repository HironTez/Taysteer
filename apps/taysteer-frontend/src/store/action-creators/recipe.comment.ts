import { Dispatch } from 'react';
import {
  RecipeCommentAction,
  RecipeCommentActionTypes,
} from '../../types/recipe.comment';

export const fetchUploadRecipeComment = (
  action: 'commentRecipe' | 'answerComment' | 'edit' = 'commentRecipe',
  id: string,
  comment: string
) => {
  return async (dispatch: Dispatch<RecipeCommentAction>) => {
    try {
      dispatch({
        type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT,
      });
      const response = await fetch(
        action === 'commentRecipe'
          ? `/api/recipes/${id}/comments`
          : `/api/recipes/comments/${id}`,
        {
          method: action === 'edit' ? 'PUT' : 'POST',
          body: JSON.stringify({ text: comment }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_SUCCESS,
          payload: await response.json(),
        });
      } else if (response.status === 401) {
        dispatch({
          type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR,
          payload: 'Unauthorized',
        });
        return;
      } else if (response.status !== 201) {
        dispatch({
          type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR,
          payload: 'Error on comment upload',
        });
        return;
      }
    } catch {
      dispatch({
        type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR,
        payload: 'Error on comment upload',
      });
    }
  };
};

export const fetchDeleteRecipeComment = (id: string) => {
  return async (dispatch: Dispatch<RecipeCommentAction>) => {
    try {
      dispatch({
        type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT,
      });
      const response = await fetch(`/api/recipes/comments/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        dispatch({
          type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_SUCCESS,
          payload: true,
        });
      } else if (response.status === 401) {
        dispatch({
          type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR,
          payload: 'Unauthorized',
        });
        return;
      } else if (response.status !== 204) {
        dispatch({
          type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR,
          payload: 'Error on comment upload',
        });
        return;
      }
    } catch {
      dispatch({
        type: RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR,
        payload: 'Error on comment upload',
      });
    }
  };
};
