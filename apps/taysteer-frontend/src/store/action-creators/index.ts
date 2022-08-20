import * as RecipeActionsCreator from './recipes';
import * as AccountActionCreator from './account';
import * as RecipeActionCreator from './recipe';
import * as ProfileActionCreator from './profile';
import * as UploadRecipeActionCreator from './upload.recipe';

export default {
  ...RecipeActionsCreator,
  ...AccountActionCreator,
  ...RecipeActionCreator,
  ...ProfileActionCreator,
  ...UploadRecipeActionCreator,
};
