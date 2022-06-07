import { recipesReducer } from './recipes.reducer';
import { combineReducers } from 'redux';
import { accountReducer } from './account.reducer';
import { recipeReducer } from './recipe.reducer';

export const rootReducer = combineReducers({
  recipes: recipesReducer,
  account: accountReducer,
  recipe: recipeReducer,
});

export type RooState = ReturnType<typeof rootReducer>;
