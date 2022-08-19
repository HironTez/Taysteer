import { combineReducers } from 'redux';
import { profileReducer } from './profile.reducer';
import { recipesReducer } from './recipes.reducer';
import { accountReducer } from './account.reducer';
import { recipeReducer } from './recipe.reducer';
import { createRecipeReducer } from './create-recipe.reducer';

export const rootReducer = combineReducers({
  recipes: recipesReducer,
  account: accountReducer,
  recipe: recipeReducer,
  profile: profileReducer,
  createRecipe: createRecipeReducer,
});

export type RooState = ReturnType<typeof rootReducer>;
