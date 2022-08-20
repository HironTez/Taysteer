import { UploadRecipeAction, UploadRecipeActionTypes, UploadRecipeState } from "../../types/upload.recipe";

const initialState: UploadRecipeState = {
  recipe: null,
  loading: false,
  error: null,
};

export const uploadRecipeReducer = (
  state: UploadRecipeState = initialState,
  action: UploadRecipeAction
): UploadRecipeState => {
  switch (action.type) {
    case UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE:
      return { ...state, loading: true, error: null };
    case UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_SUCCESS:
      return {
        recipe: action.payload,
        loading: false,
        error: null,
      };
    case UploadRecipeActionTypes.FETCH_UPLOAD_RECIPE_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
