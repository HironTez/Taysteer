import { recipeReducer } from './recipeReducer';
import { combineReducers } from "redux";
import { accountReducer } from './accountReducer';

export const rootReducer = combineReducers({
  recipe: recipeReducer,
  account: accountReducer
})

export type RooState = ReturnType<typeof rootReducer>