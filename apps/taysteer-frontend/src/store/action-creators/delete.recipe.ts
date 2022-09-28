import { Dispatch } from 'react';
import {
  DeleteRecipeAction,
  DeleteRecipeActionTypes,
} from '../../types/delete.recipe';

export const fetchDeleteRecipe = (recipe_id: string | undefined) => {
  if (!recipe_id) return false;
  return async (dispatch: Dispatch<DeleteRecipeAction>) => {
    try {
      dispatch({ type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE });
      const response = await fetch(`/api/recipes/${recipe_id}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        dispatch({
          type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_SUCCESS,
          payload: true,
        });
      } else if (response.status === 401) {
        dispatch({
          type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_ERROR,
          payload: 'Unauthorized',
        });
        return;
      } else if (response.status !== 200) {
        dispatch({
          type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_ERROR,
          payload: 'Error on rating',
        });
        return;
      }
    } catch {
      dispatch({
        type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_ERROR,
        payload: 'Error on rating',
      });
    }
  };
};

export const deleteRecipeHandled = () => {
  return async (dispatch: Dispatch<DeleteRecipeAction>) => {
    dispatch({
      type: DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_SUCCESS,
      payload: false,
    });
  };
};
