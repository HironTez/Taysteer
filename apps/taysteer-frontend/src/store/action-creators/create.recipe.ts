import { Dispatch } from 'react';
import {
  CreateRecipeAction,
  CreateRecipeActionTypes,
} from '../../types/create.recipe';
import $ from 'jquery';

export const fetchCreateRecipe = (recipe: FormData) => {
  return async (dispatch: Dispatch<CreateRecipeAction>) => {
    try {
      dispatch({ type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE });
      $.ajax({
        url: `/api/recipes`,
        method: 'POST',
        processData: false,
        contentType: false,
        data: recipe,
        enctype: 'multipart/form-data',
      })
        .done((response) => {
          dispatch({
            type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE_SUCCESS,
            payload: response,
          });
        })
        .fail((error) => {
          if (error.status === 401) {
            dispatch({
              type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE_ERROR,
              payload: 'Unauthorized',
            });
          } else {
            dispatch({
              type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE_ERROR,
              payload: 'Error on recipe uploading',
            });
          }
        });
    } catch {
      dispatch({
        type: CreateRecipeActionTypes.FETCH_CREATE_RECIPE_ERROR,
        payload: 'Error on recipe uploading',
      });
    }
  };
};
