import { RecipeIngredientT, RecipeStepT } from "./recipe.types";

export class RecipeDataDto {
  title: string;
  description: string;
  ingredients: RecipeIngredientT[];
  steps: RecipeStepT[];
}