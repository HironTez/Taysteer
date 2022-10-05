import { User } from '../users/user.model';
import { RecipeIngredientT, RecipeStepT } from './recipe.types';

export class RecipeDataDto {
  title: string | undefined;
  description: string | undefined;
  ingredients: RecipeIngredientT[] | undefined;
  steps: { [key: string]: RecipeStepT } = {};
  image: string | undefined;
  user: User | undefined;
  [key: string]: any;
}

export class RecipeCommentDto {
  text: string | undefined;
}
