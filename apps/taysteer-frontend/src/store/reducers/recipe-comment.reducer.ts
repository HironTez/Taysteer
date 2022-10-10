import {
  RecipeCommentAction,
  RecipeCommentActionTypes,
  RecipeCommentState,
} from '../../types/recipe.comment';

const initialState: RecipeCommentState = {
  result: null,
  loading: false,
  error: null,
};

export const recipeCommentReducer = (
  state: RecipeCommentState = initialState,
  action: RecipeCommentAction
): RecipeCommentState => {
  switch (action.type) {
    case RecipeCommentActionTypes.FETCH_RECIPE_COMMENT:
      return { result: null, loading: true, error: null };
    case RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_SUCCESS:
      return {
        result: action.payload,
        loading: false,
        error: null,
      };
    case RecipeCommentActionTypes.FETCH_RECIPE_COMMENT_ERROR:
      return { result: null, loading: false, error: action.payload };
    default:
      return state;
  }
};
