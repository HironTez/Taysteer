import { Dispatch } from 'react';
import { RateRecipeAction, RateRecipeActionTypes } from '../../types/rate.recipe';

export const fetchRateRecipe = (recipe_id: string, rating: number) => {
  return async (dispatch: Dispatch<RateRecipeAction>) => {
    try {
      dispatch({ type: RateRecipeActionTypes.FETCH_RATE_RECIPE });
      const response = await fetch(`/api/recipes/${recipe_id}/rate?rating=${rating}`, {
        method: 'POST'
      });
      if (response.status === 200) {
        dispatch({
          type: RateRecipeActionTypes.FETCH_RATE_RECIPE_SUCCESS,
          payload: true,
        });
      } else if (response.status === 401) {
        dispatch({
          type: RateRecipeActionTypes.FETCH_RATE_RECIPE_ERROR,
          payload: 'Unauthorized',
        });
        return;
      } else if (response.status !== 200) {
        dispatch({
          type: RateRecipeActionTypes.FETCH_RATE_RECIPE_ERROR,
          payload: 'Error on rating',
        });
        return;
      }
    } catch {
      dispatch({
        type: RateRecipeActionTypes.FETCH_RATE_RECIPE_ERROR,
        payload: 'Error on rating',
      });
    }
  };
};
