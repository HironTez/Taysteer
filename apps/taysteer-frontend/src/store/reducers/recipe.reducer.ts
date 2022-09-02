import {
  RecipeAction,
  RecipeActionTypes,
  RecipeState,
} from '../../types/recipe';

const initialState: RecipeState = {
  recipe: null,
  loading: false,
  error: null,
};

export const recipeReducer = (
  state: RecipeState = initialState,
  action: RecipeAction
): RecipeState => {
  switch (action.type) {
    case RecipeActionTypes.FETCH_RECIPE:
      return { ...state, loading: true, error: null };
    case RecipeActionTypes.FETCH_RECIPE_SUCCESS:
      return {
        recipe: action.payload,
        loading: false,
        error: null,
      };
    case RecipeActionTypes.FETCH_RECIPE_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
