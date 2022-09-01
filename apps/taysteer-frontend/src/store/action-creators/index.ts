import * as RecipeActionsCreator from './recipes';
import * as AccountActionCreator from './account';
import * as RecipeActionCreator from './recipe';
import * as ProfileActionCreator from './profile';
import * as UploadRecipeActionCreator from './upload.recipe';
import * as RateRecipeActionCreator from './rate.recipe';
import * as RecipeCommentsActionCreator from './recipe.comments';

export default {
  ...RecipeActionsCreator,
  ...AccountActionCreator,
  ...RecipeActionCreator,
  ...ProfileActionCreator,
  ...UploadRecipeActionCreator,
  ...RateRecipeActionCreator,
  ...RecipeCommentsActionCreator,
};
