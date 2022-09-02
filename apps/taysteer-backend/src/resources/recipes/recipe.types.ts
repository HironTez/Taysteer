import { UserToResponseT } from '../users/user.types';

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
  user: Promise<UserToResponseT>;
  ingredients: Array<RecipeIngredientT>;
  steps: { [key: number]: RecipeStepT };
  countOfComments: number;
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
  user: Promise<UserToResponseT>;
  date: Date;
  updated: boolean;
  countOfChildComments: number;
}

export interface CommentToResponseDetailedT {
  id: number;
  text: string;
  user: Promise<UserToResponseT>;
  date: Date;
  updated: boolean;
  countOfChildComments: number;
  childComments: Array<CommentToResponseT> | null;
}
