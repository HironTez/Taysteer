import { recipeReducer } from './recipeReducer';
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  recipe: recipeReducer,
})

export type RooState = ReturnType<typeof rootReducer>