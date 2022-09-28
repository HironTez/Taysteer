import {
  DeleteRecipeAction,
  DeleteRecipeActionTypes,
  DeleteRecipeState,
} from '../../types/delete.recipe';

const initialState: DeleteRecipeState = {
  success: false,
  loading: false,
  error: null,
};

export const deleteRecipeReducer = (
  state: DeleteRecipeState = initialState,
  action: DeleteRecipeAction
): DeleteRecipeState => {
  switch (action.type) {
    case DeleteRecipeActionTypes.FETCH_DELETE_RECIPE:
      return { success: false, loading: true, error: null };
    case DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_SUCCESS:
      return {
        success: action.payload,
        loading: false,
        error: null,
      };
    case DeleteRecipeActionTypes.FETCH_DELETE_RECIPE_ERROR:
      return { success: false, loading: false, error: action.payload };
    default:
      return state;
  }
};
