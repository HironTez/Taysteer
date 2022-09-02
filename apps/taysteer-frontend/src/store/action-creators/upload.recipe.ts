import { Dispatch } from 'react';
import {
  UploadRecipeAction,
  UploadRecipeActionTypes,
} from '../../types/upload.recipe';
import $ from 'jquery';

export const fetchUploadRecipe = (recipe: FormData, edit = false, recipeId?: string) => {
  return async (dispatch: Dispatch<UploadRecipeAction>) => {
    try {
      dispatch({ type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE });
      $.ajax({
        url: edit ? `/api/recipes/${recipeId}` : `/api/recipes`,
        method: edit ? 'PUT' : 'POST',
        processData: false,
        contentType: false,
        data: recipe,
        enctype: 'multipart/form-data',
      })
        .done((response) => {
          dispatch({
            type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_SUCCESS,
            payload: response,
          });
        })
        .fail((error) => {
          if (error.status === 401) {
            dispatch({
              type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_ERROR,
              payload: 'Unauthorized',
            });
          } else {
            dispatch({
              type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_ERROR,
              payload: 'Error on recipe uploading',
            });
          }
        });
    } catch {
      dispatch({
        type: UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_ERROR,
        payload: 'Error on recipe uploading',
      });
    }
  };
};
