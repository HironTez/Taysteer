import { UserToResponseT } from "../users/user.types";

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
  user: UserToResponseT;
  ingredients: Array<RecipeIngredientT>;
  steps: Array<RecipeStepT>,
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

export interface CommentToResponseT {
  id: number;
  text: string;
  user: UserToResponseT;
  date: Date;
  updated: boolean;
  childComments: Array<CommentToResponseT> | null;
}
