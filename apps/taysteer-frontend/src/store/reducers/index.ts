import { combineReducers } from 'redux';
import { profileReducer } from './profile.reducer';
import { recipesReducer } from './recipes.reducer';
import { accountReducer } from './account.reducer';
import { recipeReducer } from './recipe.reducer';
import { uploadRecipeReducer } from './upload-recipe.reducer';
import { rateRecipeReducer } from './rate-recipe.reducer';
import { recipeCommentsReducer } from './recipe-comments.reducer';
import { recipeCommentReducer } from './recipe-comment.reducer';
import { deleteRecipeReducer } from './delete-recipe.reducer';
import { deleteProfileReducer } from './delete-profile.reducer';
import { updateProfileReducer } from './update-profile.reducer';

export const rootReducer = combineReducers({
  recipes: recipesReducer,
  account: accountReducer,
  recipe: recipeReducer,
  profile: profileReducer,
  uploadRecipe: uploadRecipeReducer,
  rateRecipe: rateRecipeReducer,
  recipeComments: recipeCommentsReducer,
  recipeComment: recipeCommentReducer,
  deleteRecipe: deleteRecipeReducer,
  deleteProfile: deleteProfileReducer,
  updateProfile: updateProfileReducer,
});

export type RooState = ReturnType<typeof rootReducer>;
