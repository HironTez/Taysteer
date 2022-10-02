import { Dispatch } from 'react';
import {
  UploadRecipeCommentAction,
  UploadRecipeCommentActionTypes,
} from './../../types/upload.recipe.comment';
export const fetchUploadRecipeComment = (
  answerTo: 'recipe' | 'comment',
  id: string,
  comment: string
) => {
  return async (dispatch: Dispatch<UploadRecipeCommentAction>) => {
    try {
      dispatch({
        type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT,
      });
      const response = await fetch(
        answerTo === 'recipe'
          ? `/api/recipes/${id}/comments`
          : `/api/recipes/comments/${id}`,
        {
          method: 'POST',
          body: JSON.stringify({ text: comment }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        dispatch({
          type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_SUCCESS,
          payload: await response.json(),
        });
      } else if (response.status === 401) {
        dispatch({
          type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_ERROR,
          payload: 'Unauthorized',
        });
        return;
      } else if (response.status !== 201) {
        dispatch({
          type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_ERROR,
          payload: 'Error on comment upload',
        });
        return;
      }
    } catch {
      dispatch({
        type: UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_ERROR,
        payload: 'Error on comment upload',
      });
    }
  };
};
