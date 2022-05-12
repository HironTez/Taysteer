import {
  RecipeAction,
  RecipeActionTypes,
  RecipeState,
} from '../../types/recipe';

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
  end: false,
  page: 1,
};

export const recipeReducer = (
  state: RecipeState = initialState,
  action: RecipeAction
): RecipeState => {
  switch (action.type) {
    case RecipeActionTypes.FETCH_RECIPES:
      return { ...state, loading: true, error: null };
    case RecipeActionTypes.FETCH_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        end: !action.payload.length,
        recipes: state.recipes.concat(action.payload),
      };
    case RecipeActionTypes.FETCH_RECIPES_ERROR:
      return { ...state, loading: false, error: action.payload };
    case RecipeActionTypes.SET_RECIPES_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
};
