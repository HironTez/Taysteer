import {
  UploadRecipeCommentAction,
  UploadRecipeCommentActionTypes,
  UploadRecipeCommentState,
} from '../../types/upload.recipe.comment';

const initialState: UploadRecipeCommentState = {
  resultComment: null,
  loading: false,
  error: null,
};

export const uploadRecipeCommentReducer = (
  state: UploadRecipeCommentState = initialState,
  action: UploadRecipeCommentAction
): UploadRecipeCommentState => {
  switch (action.type) {
    case UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT:
      return { resultComment: null, loading: true, error: null };
    case UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_SUCCESS:
      return {
        resultComment: action.payload,
        loading: false,
        error: null,
      };
    case UploadRecipeCommentActionTypes.FETCH_UPLOAD_RECIPE_COMMENT_ERROR:
      return { resultComment: null, loading: false, error: action.payload };
    default:
      return state;
  }
};
