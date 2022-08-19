import { Dispatch } from 'react';
import { RecipeActions, RecipeActionTypes } from '../../types/recipes';

export const fetchRecipes = (page = 1, userId?: string) => {
  return async (dispatch: Dispatch<RecipeActions>) => {
    try {
      dispatch({ type: RecipeActionTypes.FETCH_RECIPES });
      const link = userId ? `/api/users/${userId}/recipes` : '/api/recipes';
      const response = await fetch(`${link}?page=${page}`);
      if (response.status !== 200) {
        dispatch({
          type: RecipeActionTypes.FETCH_RECIPES_ERROR,
          payload: 'Error on recipe loading',
        });
        return;
      }
      const responseJson = await response.json();
      dispatch({
        type: RecipeActionTypes.FETCH_RECIPES_SUCCESS,
        payload: responseJson,
      });
    } catch {
      dispatch({
        type: RecipeActionTypes.FETCH_RECIPES_ERROR,
        payload: 'Error on recipe loading',
      });
    }
  };
};

export const setRecipePage = (page: number): RecipeActions => {
  return { type: RecipeActionTypes.SET_RECIPES_PAGE, payload: page };
};

export const clearRecipeList = (): RecipeActions => {
  return {
    type: RecipeActionTypes.CLEAR_RECIPES,
  };
};
