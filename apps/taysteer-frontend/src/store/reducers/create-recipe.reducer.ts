import { CreateRecipeAction, CreateRecipeActionTypes, CreateRecipeState } from "../../types/create.recipe";

const initialState: CreateRecipeState = {
  recipe: null,
  loading: false,
  error: null,
};

export const createRecipeReducer = (
  state: CreateRecipeState = initialState,
  action: CreateRecipeAction
): CreateRecipeState => {
  switch (action.type) {
    case CreateRecipeActionTypes.FETCH_CREATE_RECIPE:
      return { ...state, loading: true, error: null };
    case CreateRecipeActionTypes.FETCH_CREATE_RECIPE_SUCCESS:
      return {
        recipe: action.payload,
        loading: false,
        error: null,
      };
    case CreateRecipeActionTypes.FETCH_CREATE_RECIPE_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
