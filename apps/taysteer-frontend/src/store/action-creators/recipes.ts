import { Dispatch } from 'react';
import { RecipesAction, RecipesActionTypes } from '../../types/recipes';

export const fetchRecipes = (page = 1, userId?: string) => {
  console.log(userId);
  return async (dispatch: Dispatch<RecipesAction>) => {
    try {
      dispatch({ type: RecipesActionTypes.FETCH_RECIPES });
      const link = userId ? `/api/users/${userId}/recipes` : '/api/recipes';
      const response = await fetch(`${link}?page=${page}`);
      if (response.status !== 200) {
        dispatch({
          type: RecipesActionTypes.FETCH_RECIPES_ERROR,
          payload: 'Error on recipes loading',
        });
        return;
      }
      const responseJson = await response.json();
      dispatch({
        type: RecipesActionTypes.FETCH_RECIPES_SUCCESS,
        payload: responseJson,
      });
    } catch (e) {
      dispatch({
        type: RecipesActionTypes.FETCH_RECIPES_ERROR,
        payload: 'Error on recipes loading',
      });
    }
  };
};

export const setRecipesPage = (page: number): RecipesAction => {
  return { type: RecipesActionTypes.SET_RECIPES_PAGE, payload: page };
};
