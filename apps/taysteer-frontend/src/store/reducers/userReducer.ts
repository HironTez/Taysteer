import {
  RecipeAction,
  RecipeActionTypes,
  RecipeState,
} from './../../types/recipe';

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

export const recipeReducer = (
  state: RecipeState = initialState,
  action: RecipeAction
): RecipeState => {
  switch (action.type) {
    case RecipeActionTypes.FETCH_RECIPES:
      return { loading: true, error: null, recipes: [] };
    case RecipeActionTypes.FETCH_RECIPES_SUCCESS:
      return { loading: false, error: null, recipes: action.payload };
    case RecipeActionTypes.FETCH_RECIPES_ERROR:
      return { loading: false, error: action.payload, recipes: [] };
    default:
      return state;
  }
};
