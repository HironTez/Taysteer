import { Dispatch } from 'react';
import { RecipeAction, RecipeActionTypes } from '../../types/recipe';

export const fetchRecipe = (id: string) => {
  return async (dispatch: Dispatch<RecipeAction>) => {
    try {
      dispatch({ type: RecipeActionTypes.FETCH_RECIPE });
      const response = await fetch(`/api/recipes/${id}`);
      if (response.status !== 200) {
        dispatch({
          type: RecipeActionTypes.FETCH_RECIPE_ERROR,
          payload: 'Error on recipe loading',
        });
        return;
      }
      const responseJson = await response.json();
      dispatch({
        type: RecipeActionTypes.FETCH_RECIPE_SUCCESS,
        payload: responseJson,
      });
    } catch {
      dispatch({
        type: RecipeActionTypes.FETCH_RECIPE_ERROR,
        payload: 'Error on recipe loading',
      });
    }
  };
};
