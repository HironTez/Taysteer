import {
  RecipeActions,
  RecipeActionTypes,
  RecipesState,
} from '../../types/recipes';

const initialState: RecipesState = {
  recipes: [],
  loading: false,
  error: null,
  end: false,
  page: 1,
};

export const recipesReducer = (
  state: RecipesState = initialState,
  action: RecipeActions
): RecipesState => {
  switch (action.type) {
    case RecipeActionTypes.FETCH_RECIPES:
      return { ...state, loading: true, error: null };
    case RecipeActionTypes.FETCH_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        end: action.payload.length < 10,
        recipes: state.recipes.concat(action.payload),
      };
    case RecipeActionTypes.FETCH_RECIPES_ERROR:
      return { ...state, loading: false, error: action.payload };
    case RecipeActionTypes.SET_RECIPES_PAGE:
      return { ...state, page: action.payload };
    case RecipeActionTypes.CLEAR_RECIPES:
      state.recipes = [];
      return { ...state, recipes: [], page: 1 };
    default:
      return state;
  }
};
