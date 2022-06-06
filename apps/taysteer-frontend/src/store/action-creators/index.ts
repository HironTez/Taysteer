import * as RecipeActionCreator from './recipes';
import * as AccountActionCreator from './account';

export default {
  ...RecipeActionCreator,
  ...AccountActionCreator,
};
