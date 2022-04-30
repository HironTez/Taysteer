import { recipeReducer } from './userReducer';
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  recipe: recipeReducer,
})

export type RooState = ReturnType<typeof rootReducer>