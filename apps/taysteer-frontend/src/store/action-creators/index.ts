import * as RecipesActionCreator from './recipes';
import * as AccountActionCreator from './account';
import * as RecipeActionCreator from './recipe';

export default {
  ...RecipesActionCreator,
  ...AccountActionCreator,
  ...RecipeActionCreator,
};
