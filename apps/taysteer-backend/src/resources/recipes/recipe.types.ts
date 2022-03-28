import { User } from "../users/user.model";
import { Recipe } from "./recipe.model";

export interface RecipeToResponseT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
}

export interface RecipeToResponseDetailedT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
  ratingsCount: number;
  user: User;
  ingredients: Array<RecipeIngredientT>;
  comments: Array<CommentT>;
}

export interface RecipeIngredientT {
  count: number;
  name: string;
  optional: boolean;
}

export interface RecipeStepT {
  title: string;
  description: string;
  image: string;
}

export interface RecipeRaterT {
  id: number;
  raterId: string;
  rating: number;
  user: Recipe;
}

export interface CommentT {
  id: number;
  commentatorId: string;
  text: string;
}
