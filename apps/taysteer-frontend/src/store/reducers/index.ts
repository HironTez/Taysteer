import { combineReducers } from 'redux';
import { profileReducer } from './profile.reducer';
import { recipesReducer } from './recipes.reducer';
import { accountReducer } from './account.reducer';
import { recipeReducer } from './recipe.reducer';
import { uploadRecipeReducer } from './upload-recipe.reducer';

export const rootReducer = combineReducers({
  recipes: recipesReducer,
  account: accountReducer,
  recipe: recipeReducer,
  profile: profileReducer,
  uploadRecipe: uploadRecipeReducer,
});

export type RooState = ReturnType<typeof rootReducer>;
