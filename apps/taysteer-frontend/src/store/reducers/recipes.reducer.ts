import {
  RecipesAction,
  RecipesActionTypes,
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
  action: RecipesAction
): RecipesState => {
  switch (action.type) {
    case RecipesActionTypes.FETCH_RECIPES:
      return { ...state, loading: true, error: null };
    case RecipesActionTypes.FETCH_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        end: action.payload.length < 10,
        recipes: state.recipes.concat(action.payload),
      };
    case RecipesActionTypes.FETCH_RECIPES_ERROR:
      return { ...state, loading: false, error: action.payload };
    case RecipesActionTypes.SET_RECIPES_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
};
