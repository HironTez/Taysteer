import { User } from '../users/user.model';
import { RecipeIngredientT, RecipeStepT } from "./recipe.types";

export class RecipeDataDto {
  title: string;
  description: string;
  ingredients: RecipeIngredientT[];
  steps: {[key: number]: RecipeStepT};
  image: string;
  user: User
}

export class RecipeCommentDto {
  text: string;
}