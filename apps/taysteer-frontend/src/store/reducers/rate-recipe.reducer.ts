import { RateRecipeAction, RateRecipeActionTypes, RateRecipeState } from "../../types/rate.recipe";

const initialState: RateRecipeState = {
  loading: false,
  error: null,
};

export const rateRecipeReducer = (
  state: RateRecipeState = initialState,
  action: RateRecipeAction
): RateRecipeState => {
  switch (action.type) {
    case RateRecipeActionTypes.FETCH_RATE_RECIPE:
      return { ...state, loading: true, error: null };
    case RateRecipeActionTypes.FETCH_RATE_RECIPE_SUCCESS:
      return {
        loading: false,
        error: null,
      };
    case RateRecipeActionTypes.FETCH_RATE_RECIPE_ERROR:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
