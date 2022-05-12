import { Dispatch } from 'react';
import { HOST_BACKEND } from '../../configs/common/config';
import { RecipeAction, RecipeActionTypes } from '../../types/recipe';

export const fetchRecipes = (page = 1) => {
  return async (dispatch: Dispatch<RecipeAction>) => {
    try {
      dispatch({ type: RecipeActionTypes.FETCH_RECIPES });
      const response = await fetch(
        `http://${HOST_BACKEND}/recipes?page=${page}`
      );
      const responseJson = await response.json();
      dispatch({
        type: RecipeActionTypes.FETCH_RECIPES_SUCCESS,
        payload: responseJson,
      });
    } catch (e) {
      dispatch({
        type: RecipeActionTypes.FETCH_RECIPES_ERROR,
        payload: 'Error on recipes loading',
      });
    }
  };
};

export const setRecipesPage = (page: number): RecipeAction => {
  return { type: RecipeActionTypes.SET_RECIPES_PAGE, payload: page };
};
